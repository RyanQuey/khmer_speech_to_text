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

const {Helpers} = require("./helpers.js")

const app = express();
app.use(cors);
// TODO add back in for security
app.use(cookieParser);
app.use(Helpers.validateFirebaseIdToken);

// can do v1 or v1 beta...don't think there's an alpha yet
const apis = ["v1", "v1p1beta"]
const requestOptions = {
  // a test option, to try to convert from base64 to file so see if it is right
  convertToFile: false,
  // not sure when this is helpful, but sometimes it is 
  multipleChannels: false, 
  api: apis[1],
}

// TODO add error handling
app.post('/upload-audio', (req, res, next) => {
  async function main() {
    try {
  
      console.log("req.headers", req.headers)
      const options = _.clone(requestOptions)
      const requestData = Helpers.setupRequest(req, options)

      // Detects speech in the audio file
      // For now, just always doing long requests, for simplicity in handling
      const isLongFile = true || Helpers.isLongFile(requestData)

      let response
      if (isLongFile) {
        // not using await, to avoid timeout. Letting it run async
        Helpers.requestLongRunningRecognize(requestData, req, options)
        res.send({
          done: false
        });

      } else {
        Helpers.requestRecognize(requestData, options)
        const results = response.results

        res.send({
          done: true
        });
      }

      return

    } catch (error) {
      console.error("Error while requesting transcript for audio file: ", error);
      next(error)
      return;
    }
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
