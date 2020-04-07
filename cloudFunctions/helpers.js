const fs = require('fs');
const admin = require('firebase-admin');
const moment = require("moment");
// Imports the Google Cloud client library
// TODO consider hitting the api directly, might be able to do all in the browser
const speech = require('@google-cloud/speech');
const betaSpeech = speech.v1p1beta1;
const cloudFunctions = require('firebase-functions')
// required for local development to work with firestore according to https://github.com/firebase/firebase-tools/issues/1363#issuecomment-498364771

// Creates a client
const client = new speech.SpeechClient();
const betaClient = new betaSpeech.SpeechClient();

// some constants
const WHITE_LISTED_USERS = [
  "rlquey2@gmail.com",
  "borachheang@gmail.com",
]
// note: not all flietypes supported yet. E.g., mp4 might end up being under flac or something. Eventually, handle all file types and either convert file or do something
const FILE_TYPES = ["flac", "mp3", "wav"] 
const fileTypesSentence = FILE_TYPES.slice(0, FILE_TYPES.length - 1).join(', ') + ", and " + FILE_TYPES.slice(-1);

// Setup firebase admin sdk
const isDev = cloudFunctions.config().app.env == "DEVELOPMENT"
console.log("is dev?", isDev)
let db 
if (isDev) {
  // I think don't need the cloud env vars? Just the credential set? 
  // or maybe setup using .runtimeconfig.json?
  // https://firebase.google.com/docs/firestore/quickstart#initialize
  // required for us to access admin stuff from local cloud functions

  // this is the admin key for admin sdk, process.env.GOOGLE_APPLICATION_CREDENTIALS key has no role
  const adminKey = "/home/ryan/khmer-speech-to-text-4ad8e961215b.json"
  let serviceAccount = require(adminKey || process.env.GOOGLE_APPLICATION_CREDENTIALS);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })

} else {
  admin.initializeApp(cloudFunctions.config().firebase);
}

db = admin.firestore()


const baseConfig = {
  encoding: 'LINEAR16',
  languageCode: 'km-KH',
  sampleRateHertz: undefined, // TODO or try 16000...but undefined lets google set it themselves,
  enableAutomaticPunctuation: true,
  model: "default", //  Google: "Best for audio that is not one of the specific audio models. For example, long-form audio. Ideally the audio is high-fidelity, recorded at a 16khz or greater sampling rate."
}

const flacConfig = Object.assign({}, baseConfig, {
  // or maybe FLAC ?
  encoding: 'flac',
  sampleRateHertz: undefined, // NOTE one time, flac file (that was from mp4) had 44100 herz required, so better to just not set until can find out dynamically
  // NOTE sometimes has two channels, sometimes not
  //audioChannelCount: 2,
  //enableSeparateRecognitionPerChannel: true, 
})

const mp3Config = Object.assign({}, baseConfig, {
  encoding: 'mp3',
  sampleRateHertz: 16000,  // 8000 might be plenty 
})

const Helpers = {
  isBase64: (str) => (
    Buffer.from(str, 'base64').toString('base64') === str
  ),

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
  validateFirebaseIdToken: async (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      res.status(403).send('Unauthorized');
      return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send('Unauthorized');
      return;
    }

    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      console.log('ID Token correctly decoded');
      req.user = decodedIdToken;

      if (!req.user.email_verified) {
        // make them verify it first
        res.status(403).send('Unauthorized');
        return;
      }
      // currently only allowing whitelisted users to use
      if (!WHITE_LISTED_USERS.includes(req.user.email)) {
        res.status(403).send("Your email isn't allowed to use our service yet; please contact us to get your account setup");
        return
      }

      next();
      return;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
      return;
    }
  },

  // returns request body and mutates requestOptions along the way 
  setupRequest: (req, requestOptions) => {
    // TODO doesn't work
    let fileData = req.file
    const fileType = req.body.fileType
    requestOptions.fileType = fileType
    requestOptions.fileExtension = fileType.replace("audio/", "")
    requestOptions[requestOptions.fileExtension] = true

    if (!FILE_TYPES.includes(requestOptions.fileExtension)) {
      throw `File type ${requestOptions.fileExtension} is not allowed, only ${fileTypesSentence}`
    }

    const {flac, wav, mp3, convertToFile, multipleChannels} = requestOptions

    fileData = req.body.base64

    // just for testing
    if (convertToFile) {
      fs.writeFileSync(`/home/ryan/projects/khmer-speech-to-text/temp-audio.${flac ? "flac" : "m4a"}`, Buffer.from(fileData))
      // if converting to file, not continuing for now because converting to file is only for testing, so don't waste api hits
      return
    }
  
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    let config, audioBytes, content
    // TODO set flac, mp3, or base64 dynamically depending on the file received (base64 encoding the file will set it with a header which states the filetype)
    if (flac) {
      // not sure if owrks
      console.log("setting as flac")

      content = fileData
      config = flacConfig;

    } else if (mp3) {
      console.log("setting as mp3")
      // strangely enough, if send base64 of mp3 file, but use flacConfig, returns results like the flac file, but smaller file size. In part, possibly due ot the fact that there is multiple speakers set for flacConfig currently
      content = fileData
      config = mp3Config;

    } else if (Helpers.isBase64(fileData)) {
      console.log("got the base64")
      content = fileData
      config = baseConfig

    } else {
      // NOTE doesn't work
      // turn it into base64 / linear16
      // Reads a local audio file and converts it to base64
      // req.body is a buffer, so read it and send it to base64
      //
      // Not sure which one is right
      // audioBytes = Buffer.from(req.body, 'base64')
      audioBytes = Buffer.from(req.body)
      // audioBytes = req.body
      console.log("not the base64, so making it base64")
      content = audioBytes.toString("base64")
      config = baseConfig
    }

    // NOTE flac config automatically sets this
    if (multipleChannels) {
      config.audioChannelCount = 2, //might try more later
      config.enableSeparateRecognitionPerChannel = true
    }

    // set which api client to use
    if (requestOptions.api == "v1p1beta") {
      requestOptions.beta = true
    }

    console.log("sending with config", config)

    // content should be base64 by this point
    const audio = {
      content,
    };
    const request = {
      audio,
      config,
    };
  
    return request
  },

  isLongFile: (requestPayload) => {
    // base64 for 12 sec file was .length 415820, assuming 60 sec is 5* that, around 2 mil
    // 2:36 mp3 from bible recording (1 Sam 31) is length 834668
    // play it safe, just do long running if more than 600,000
    const base64 = requestPayload.audio.content

    console.log("length", base64.length)
    return base64.length > 6*100*1000
  },

  // NOTE not for real transcript handling, will not write results to DB
  requestRecognize: async (request, options = {}) => {
    console.log("options here is", options)
    const theClient = options.beta ? betaClient : client
    const [response] = await theClient.recognize(request);

    await Helpers.handleTranscriptResults(req, response.results)
    return response
  },

  requestLongRunningRecognize: async (request, req, options = {}) => {
    try {
      console.log("Using Beta client?", !!options.beta)

      console.log("options here is", options)
      const theClient = options.beta ? betaClient : client
      // this is initial response, not complete transcript yet
      const result = await theClient.longRunningRecognize(request);
      const [operation] = result

      // Get a Promise representation of the final result of the job
      // this part is async, will not return the final result, will just write it in the db
      // Otherwise, will timeout
      //const [response] = await operation.promise();
      operation.promise()
        .then((final) => {
          console.log("so what is this anyways?", final)
          const [response, longRunningRecognizeMetadata, data] = final
          
          console.log(data, typeof data)
          return Helpers.handleTranscriptResults(req, response.results, data.name)
        })
        .then(() => {
          console.log("all done?")
        })
        .catch((err) => {
        
          console.log("Failed handling long recognize transcript results")
          Helpers.handleDbError(err)
        })

      return result
    } catch (error) {
      console.error('Error while doing a long-running request:', error);
      if (options.failedAttempts == 0) {
        options.failedAttempts ++ 

        if ([
          "Must use single channel (mono) audio, but WAV header indicates 2 channels.",  // got with fileout.wav. code 3
          "Invalid audio channel count", // got with fileout.flac 
        ].includes(error.details)) {
          // try again with different channel configuration
          
          console.log("trying again, but with multiple channel configuration.")
          options.multipleChannels = true
          const newRequestData = Helpers.setupRequest(req, options)
          console.log(`Attempt #: ${options.failedAttempts + 1}`)
          Helpers.requestLongRunningRecognize(newRequestData, req, options)
        }
      }
    }
  },

  // maybe in future, store base64. Not necessary for now though, and we're billed by amount of data is stored here, so better not to. There's cheaper ways if we want to do this
  handleTranscriptResults: async (req, results, transactionName) => {
    const { user } = req
    const base64Start = req.body.base64.slice(0, 10)
    const { fileMetadata, filename, fileType, fileLastModified, fileSize } = req.body
    // want sorted by base64 so each file is easily grouped, but also timestamped so can support multiple uploads
    const timestamp = moment().format("YYYYMMDDHHMMss")
    // could also grab the name of the request (its a short-ish unique assigned by Google integer) if ever want to match this to the api call to google
    const docName = `${base64Start}-at-${timestamp}`
    const docRef = db.collection('users').doc(user.uid)
      .collection("transcripts").doc(docName);

    // set results into firestore
    await docRef.set({
      base64Start,
      createdAt: timestamp,
      filename,
      fileType,
      fileLastModified,
      fileSize,
      transactionId: transactionName, // best way to ensure a uid for this transcription
      // array of objects with single key: "alternatives" which is array as well
      // need to convert to objects or arrays only, can't do other custom types like "SpeechRecognitionResult"
      utterances: JSON.parse(JSON.stringify(results)),
    });
  
    console.log("results: ", results)
    const transcription = results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);

    return "all done"
  }, 

  handleDbError: (err) => {
    // see https://stackoverflow.com/questions/52207155/firestore-admin-in-node-js-missing-or-insufficient-permissions
    if (err.message.includes("PERMISSION_DENIED: Missing or insufficient permissions")) {
      console.log("alternatively, check to make sure service account key put into 'admin.credential.cert(serviceAccount)' has firebase-adminsdk role")
    }

    console.error("Error hitting firestore DB: ", err)
  },

  isDev,
}

exports.Helpers = Helpers
