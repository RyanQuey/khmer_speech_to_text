// copying https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js
// consider also this one, which hits a google api: 
// https://github.com/firebase/functions-samples/tree/master/authenticated-json-api/functions
const cloudFunctions = require('firebase-functions')
const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const _ = require('lodash')
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// const fs = require('fs');

const {Helpers} = require("./helpers.js")
// can do v1 or v1 beta...don't think there's an alpha yet
const apis = ["v1", "v1p1beta"]
const requestOptions = {
  // maybe better to ask users to stop doing multiple channels, unless it actually helps
  multipleChannels: false, 
  api: apis[1],
  failedAttempts: 0,
}


const app = express();
app.use(cors);
// TODO add back in for security
app.use(cookieParser);
app.use(Helpers.validateFirebaseIdToken);

// TODO add error handling
app.post('/upload-audio', (req, res, next) => {
  // TODO do this the middleware way, once we figure out how it can work!
  console.log("base64 body end", req.body.base64 && req.body.base64.slice(-15, -1))

  // TODO maybe want to deepclone first
  req.body.user = req.user
  main(req.body).catch(console.error);

  console.log("returning res")
  res.send({
    done: false
  });

  return
});

// takes req object with keys: body: {}
// TODO maybe don't be async since nothing is async anymore?
async function main(data) {
  try {

    const options = _.clone(requestOptions)
    const requestData = Helpers.setupRequest(data, options)

    // Detects speech in the audio file
    // For now, just always doing long requests, for simplicity in handling

    // not using await, to avoid timeout. Letting it run async
		console.log("starting long running recognize")
    Helpers.requestLongRunningRecognize(requestData, data, options)


    // not doing anything with returned value
    return

  } catch (error) {
    console.error("Error while requesting transcript for audio file: ", error);
    next(error)
    return;
  }
}


///////////////////////////////////////////////////////////////////////
// function endpoints/hook definitions
//
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = cloudFunctions.https.onRequest(app);
// NOTE for some reason app endpoint only works if there are at least two endpoints. Even if I just do`exports.test = cloudFunctions.https.onRequest(app);` it works, as long as there's two. TODO report on SO
exports.test = cloudFunctions.https.onRequest((req, res) => {
  res.send({testing: true})
});

// for transcribing uploaded files
exports.storageHook = cloudFunctions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType
  const fileName = path.basename(filePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('audio/')) {
    return console.log('This is not an audio file.');
  }
  
  console.log("obj", object)
  const data = {
    // google storage path
    filePath, 
    // various metadata
    fileType: contentType,
    filename: fileName,
    fileLastModified: object.metadata.fileLastModified, 
    fileSize: object.size,
    fileType: contentType, 
    // user, which is needed to indicate who to snd transcript when we've finished. Only need uid though
    user: {uid: filePath.split("/")[1]} // from `audio/${uid}/${myfile.flac}`
  }

  main(data).catch(console.error);



  return "great job"
  // TODO try this later, once we're converting filetypes to flac
  //const tempFilePath = path.join(os.tmpdir(), fileName);

  // Once uploaded delete the local file to free up disk space.
  //return fs.unlinkSync(tempFilePath);
})
