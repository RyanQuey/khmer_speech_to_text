// copying https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js
// consider also this one, which hits a google api: 
// https://github.com/firebase/functions-samples/tree/master/authenticated-json-api/functions
const cloudFunctions = require('firebase-functions')
const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const _ = require('lodash')

const fs = require('fs');
admin.initializeApp(cloudFunctions.config().firebase);
const app = express();
const {Helpers} = require("./helpers.js")

app.use(cors);
// TODO add back in for security
//app.use(cookieParser);
//app.use(Helpers.validateFirebaseIdToken);

// can do v1 or v1 beta...don't think there's an alpha yet
const apis = ["v1", "v1p1beta"]
const fileTypes = ["flac", "mp3", "wav"] // note: not all flietypes supported yet. E.g., mp4 might end up being under flac or something. Eventually, handle all file types and either convert file or do something
const requestOptions = {
  fileType: fileTypes[0], //I think generally mp3 should be base... TODO change dynamically based on filetype received. mp3 doesn't work with mp4 files
  // a test option, to try to convert from base64 to file so see if it is right
  convertToFile: false,
  // not sure when this is helpful, but sometimes it is 
  multipleChannels: false, 
  api: apis[1],
}

// TODO add error handling
app.post('/upload-audio', (req, res, next) => {
  async function main() {
  
    console.log("req.headers", req.headers)
    const requestData = Helpers.setupRequest(req, requestOptions)

    // Detects speech in the audio file
    const isLongFile = Helpers.isLongFile(requestData)

    let response
    if (isLongFile) {
      response = await Helpers.requestLongRunningRecognize(requestData)
    } else {
      response = await Helpers.requestRecognize(requestData)
    }

    console.log("full response: ", response)
    const results = response.results
    const transcription = results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);

    res.send({
      transcription,
      results,
    });
  }

  // TODO do this the middleware way, once we figure out how it can work!
  console.log("base64 body end", req.body.base64.slice(-15, -1))
  req.base64 = req.body.base64
  main().catch(console.error);

});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = cloudFunctions.https.onRequest(app);
