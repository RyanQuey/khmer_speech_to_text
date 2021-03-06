const admin = require('firebase-admin');
const moment = require("moment-timezone");
// Imports the Google Cloud client library
// TODO consider hitting the api directly, might be able to do all in the browser
const speech = require('@google-cloud/speech');
const betaSpeech = speech.v1p1beta1;
const cloudFunctions = require('firebase-functions')
const _ = require('lodash')
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const ffmpeg_static = require('ffmpeg-static');

// required for local development to work with firestore according to https://github.com/firebase/firebase-tools/issues/1363#issuecomment-498364771

// Creates a client
const client = new speech.SpeechClient();
const betaClient = new betaSpeech.SpeechClient();

// some constants
const WHITE_LISTED_USERS = cloudFunctions.config().app.white_listed_users || [
  "rlquey2@gmail.com",
]
// note: not all flietypes supported yet. E.g., mp4 might end up being under flac or something. Eventually, handle all file types and either convert file or do something
const FILE_TYPES = ["flac", "mp3", "wav"] 
const fileTypesSentence = FILE_TYPES.slice(0, FILE_TYPES.length - 1).join(', ') + ", and " + FILE_TYPES.slice(-1);

// Setup firebase admin sdk
const isDev = cloudFunctions.config().app.env == "DEVELOPMENT"
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
  admin.initializeApp(Object.assign(cloudFunctions.config().firebase || {}, {
    storageBucket: "khmer-speech-to-text.appspot.com",
  }));
}

db = admin.firestore()


const baseConfig = {
  encoding: 'LINEAR16',
  languageCode: 'km-KH',
  sampleRateHertz: undefined, // TODO or try 16000...but undefined lets google set it themselves. For some mp3s, this returns no utterances or worse results though
  enableAutomaticPunctuation: true,
  model: "default", //  Google: "Best for audio that is not one of the specific audio models. For example, long-form audio. Ideally the audio is high-fidelity, recorded at a 16khz or greater sampling rate."
  maxAlternatives: 3, // I think it's free, so why not get more ha
}

const flacConfig = Object.assign({}, baseConfig, {
  // or maybe FLAC ?
  encoding: 'flac',
  sampleRateHertz: undefined, // NOTE one time, flac file (that was from mp4) had 44100 herz required, so better to just not set until can find out dynamically
})

const mp3Config = Object.assign({}, baseConfig, {
  encoding: 'mp3',
  sampleRateHertz: 16000,  // Google's docs say: "When using this encoding, sampleRateHertz has to match the sample rate of the file being used." TODO need to find a way to dynamically test the file to see its sample rate hertz
})

const wavConfig = Object.assign({}, baseConfig, {
  encoding: undefined, // The FLAC and WAV audio file formats include a header that describes the included audio content. You can request recognition for WAV files that contain either LINEAR16 or MULAW encoded audio. If you send FLAC or WAV audio file format in your request, you do not need to specify an AudioEncoding; the audio encoding format is determined from the file header. If you specify an AudioEncoding when you send send FLAC or WAV audio, the encoding configuration must match the encoding described in the audio header; otherwise the request returns an google.rpc.Code.INVALID_ARGUMENT error code.
  sampleRateHertz: undefined, // NOTE one time, flac file (that was from mp4) had 44100 herz required, so better to just not set until can find out dynamically
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
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send('Unauthorized');
      return;
    }

    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedIdToken;

      // NOTE right now don't care if email is verified
      // if (!req.user.email_verified) {
      //   // make them verify it first
      //   console.log('Email not verified');
      //   res.status(403).send('Unauthorized');
      //   return;
      // }
      // currently only allowing whitelisted users to use
      if (!WHITE_LISTED_USERS.includes(req.user.email) && !req.user.email.match(/rlquey2\+.*@gmail.com/)) {
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
  setupRequest: (data, requestOptions) => {
    // TODO doesn't work
    const fileType = data.fileType
    requestOptions.fileType = fileType
    requestOptions.fileExtension = fileType.replace("audio/", "")
    requestOptions[requestOptions.fileExtension] = true

    if (!FILE_TYPES.includes(requestOptions.fileExtension)) {
      throw `File type ${requestOptions.fileExtension} is not allowed, only ${fileTypesSentence}`
    }

    const {flac, wav, mp3, multipleChannels} = requestOptions

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    let config, audioBytes, audio
    // TODO set flac, mp3, or base64 dynamically depending on the file received (base64 encoding the file will set it with a header which states the filetype)
    if (data.filePath) {
      // is in google cloud storage

      audio = {
        uri: `gs://khmer-speech-to-text.appspot.com/${data.filePath}`
      }

      // if no data.filePath, then there should just be base64
    } else {
      audio = {
        content: data.base64
      }
    }

    if (flac) {
      config = flacConfig;

    } else if (wav) {
      config = wavConfig;

    } else if (mp3) {
      // strangely enough, if send base64 of mp3 file, but use flacConfig, returns results like the flac file, but smaller file size. In part, possibly due ot the fact that there is multiple speakers set for flacConfig currently
      config = mp3Config;

    } else if (Helpers.isBase64(fileData)) {
      // This is for other audio files...but not sure if we should support anything else
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

    console.log("sending file: ", data.filename)
    console.log("sending with config", config)

    const request = {
      audio,
      config,
    };
  
    return request
  },

  // NOTE no longer using, just always doing long running recognize
  isLongFile: (requestPayload) => {
    // base64 for 12 sec file was .length 415820, assuming 60 sec is 5* that, around 2 mil
    // 2:36 mp3 from bible recording (1 Sam 31) is length 834668
    // play it safe, just do long running if more than 600,000
    const base64 = requestPayload.audio.content

    return base64.length > 6*100*1000
  },

  requestLongRunningRecognize: async (request, data, options = {}) => {
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
          const [response, longRunningRecognizeMetadata, responseData] = final
          
          return Helpers.handleTranscriptResults(data, response.results, responseData.name)
        })
        .then(() => {
          console.log("all done")
        })
        .catch((err) => {
        
          console.log("Failed handling long recognize transcript results")
          Helpers.handleDbError(err)
        })

      return result
    } catch (error) {
      console.error('Error while doing a long-running request:', error);
      if (options.failedAttempts < 2) {
        // need at least two, one for if internal error, and then if another is for channels 
        options.failedAttempts ++ 

        // https://cloud.google.com/speech-to-text/docs/error-messages
        if ([
          "Must use single channel (mono) audio, but WAV header indicates 2 channels.",  // got with fileout.wav. code 3
          "Invalid audio channel count", // got with fileout.flac 
        ].includes(error.details)) {
          // try again with different channel configuration
          
          console.log("trying again, but with multiple channel configuration.")
          options.multipleChannels = true
          console.log(`Attempt #: ${options.failedAttempts + 1}`)
          const newRequest = Helpers.setupRequest(data, options)
          Helpers.requestLongRunningRecognize(newRequest, data, options)

        } else if (error.code == 13) {
          // this is internal error Error while doing a long-running request: Error: 13 INTERNAL
          // not tested TODO

          console.log("internal error, so just trying same thing again")
          console.log(`Attempt #: ${options.failedAttempts + 1}`)
          Helpers.requestLongRunningRecognize(request, data, options)
        } else if (error.details == "WAV header indicates an unsupported format.") {
        
          // TODO panic
          // not tested TODO
        }
      }
    }
  },

  // maybe in future, store base64. Not necessary for now though, and we're billed by amount of data is stored here, so better not to. There's cheaper ways if we want to do this
  handleTranscriptResults: async (data, results, transactionName) => {
    const base64Start = data.base64 && data.base64.slice(0, 10)
    // only has filePath for uploads to storage
    const { user, filename, fileType, fileLastModified, fileSize, filePath, originalFilePath } = data

    // want sorted by filename so each file is easily grouped, but also timestamped so can support multiple uploads
    // set it and clearly but simply mark as UTC (single letter Z)
    data.createdAt = moment.utc().format("YYYYMMDDHHMMss[Z]")
    // array of objects with single key: "alternatives" which is array as well
    // need to convert to objects or arrays only, can't do other custom types like "SpeechRecognitionResult"
    data.utterances = JSON.parse(JSON.stringify(results))
    data.transactionId = transactionName // best way to ensure a uid for this transcription

    // could also grab the name of the request (its a short-ish unique assigned by Google integer) if ever want to match this to the api call to google
    const docName = `${filename}-at-${data.createdAt}`
    const docRef = db.collection('users').doc(user.uid)
      .collection("transcripts").doc(docName);

    // set results into firestore
    // lodash stuff removes empty keys , which firestore refuses to store
    await docRef.set(_.pickBy(data, _.identity));
  
    // Some logging stuff
    console.log("results: ", results)
    const transcription = results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);

    // cleanup storage and db records
    // TODO add error handling if fail to delete, so that it is marked as not deleted. Perhaps a separate try/catch so we know this is what fails, and not something after.
    // Or alternatively, something that tracks each step and marks the last completed step so we know where something stopped and can pick it up later/try again later
    if (filePath) {
      // delete file from cloud storage (bucket assigned in the admin initializeApp call)
      const storageRef = admin.storage().bucket()

      console.log("yes delete")
      await storageRef.file(filePath).delete()
    }

    if (originalFilePath) {
      // delete file from cloud storage (bucket assigned in the admin initializeApp call)
      const storageRef = admin.storage().bucket()

      console.log("yes delete original too")
      await storageRef.file(originalFilePath).delete()
    }

    // mark upload as finished transcribing
    const untranscribedUploadsRef = db.collection('users').doc(user.uid).collection("untranscribedUploads")
    const response = await untranscribedUploadsRef.delete()

    return
  }, 

  handleDbError: (err) => {
    // see https://stackoverflow.com/questions/52207155/firestore-admin-in-node-js-missing-or-insufficient-permissions
    if (err.message.includes("PERMISSION_DENIED: Missing or insufficient permissions")) {
      console.log("NOTE: check to make sure service account key put into 'admin.credential.cert(serviceAccount)' has firebase-adminsdk role")
    }

    console.error("Error hitting firestore DB: ", err)
  },

  isDev,

  // Makes an ffmpeg command return a promise.
  promisifyCommand: (command) => {
    return new Promise((resolve, reject) => {
      command.on('end', resolve).on('error', reject).run();
    });
  },

  // based on https://github.com/firebase/functions-samples/blob/master/ffmpeg-convert-audio/functions/index.js
  // TODO might be better in the future, for more flexibility and ease of use, to just use ffmpeg-static and bash code rather than a wrapper, so can write exactly as it would be in the command line
  makeItFlac: async (data, options = {}) => {
    try {
      const {filename, fileType, filePath } = data
  
		  //if (fileType !== "audio/flac") {
		  if (fileType !== "video/mp4") {
        // only converting mp4's right now, but just change this and you can
		    console.log('not converting to a flac.');
		    return null;
		  }
      console.log("flacify it", filename)
		  
		  // Download file from bucket.
		  //const bucket = gcs.bucket(fileBucket);
      const bucket = admin.storage().bucket()
		  const tempFilePath = path.join(os.tmpdir(), filename);
		  // We add a '_output.flac' suffix to target audio file name. That's where we'll upload the converted audio.
		  const targetTempFileName = filename.replace(/\.[^/.]+$/, '') + '_output.flac';
		  const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
		  const targetStorageFilePath = path.join(path.dirname(filePath), targetTempFileName);
		  
		  await bucket.file(filePath).download({destination: tempFilePath});
		  console.log('Audio downloaded locally to', tempFilePath);
		  // Convert the audio to mono channel using FFMPEG.
		  
		  let command = ffmpeg(tempFilePath)
		    .setFfmpegPath(ffmpeg_static)
		    .output(targetTempFilePath);

      if (fileType.includes("video/mp4")) {
        // equivalent of doing -vn flag
        command = command
          .withNoVideo()
          .audioCodec('flac') // equivalent of doing -acodec copy

      } else {
        // changing audio file to flac
		    command = command.format('flac')

        if (options.forceSingleChannel) {
          // TODO untested
		      command = command
            .audioChannels(1)
		        .audioFrequency(16000) // not sure if necessary for anything, much less single channel, but google used in their example
        }
      }

		  await Helpers.promisifyCommand(command);
		  console.log('Output audio created at', targetTempFilePath);

      await bucket.upload(targetTempFilePath, {destination: targetStorageFilePath});
      console.log('Output audio uploaded to', targetStorageFilePath);
		  
		  // Once the audio has been uploaded delete the local file to free up disk space.
		  fs.unlinkSync(tempFilePath);
		  fs.unlinkSync(targetTempFilePath);

      data.convertedFileName = targetTempFileName
      data.originalFileType = fileType
      data.fileType = "audio/flac"
      // need both filepath and original file path since need to delete both once we're done
      data.originalFilePath = filePath
      data.filePath = targetStorageFilePath

      return
    } catch (error) {
      // 
      console.error("Error flacifying file: ", error);
      console.log("just try it without flacifying");

    }
  },


}

exports.Helpers = Helpers
