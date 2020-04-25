import uuid from 'uuidv1';
//TODO remove lib if possible...but other libs might require it or something
import {
  CLEAR_ERRORS,
  HANDLE_ERRORS,
} from 'constants/actionTypes'
import {
  errorActions
} from 'shared/actions'
import {
  newAlert
} from 'shared/actions/alerts'
import Transcript from 'models/Transcript'

// TODO import from a constants file shared with cloud functions folder for consistency (?)
const FILE_TYPES = ["flac", "mp3", "wav"] 

let Helpers = {
  // extracts the relevant passport profile data from the profile auth data received on login/request, and matches it to the database columns
  // don't think I ever use this...only in nodeHelpers.js
  safeDataPath: function (object, keyString, def = null) {
    let keys = keyString.split('.');
    let returnValue = def;
    let safeObject = object;

    if (!safeObject) {
      return def;
    }

    for (let key of keys) {
      if (safeObject[key]) {
        returnValue = safeObject[key];
        safeObject = safeObject[key];
      } else {
        return def;
      }
    }

    return returnValue;
  },

  uniqueId: function () {
    return uuid()
  },

  //might do away with...but might be helpful if have lots of fields to iterate over
  handleParam: function (e, key) {
    const objKey = key || e.target.dataset.key
    const obj = {};

    obj[objKey] = e.target.value;

    this.setState(obj);
  },

  //TODO don't use this anymore, just call error actions
  notifyOfAPIError: (errors, templateName, templatePart, options = {})  => {
    console.log("DEPRECATED_._DON'T_USE_THIS");
    console.log(errors);
    errorActions.handleErrors(errors, templateName, templatePart, options)
  },

  //flattens array of arrays one level
  flatten: (array) => {
    return [].concat.apply([], array)
  },

  // for sending objs as query strings
  toQueryString: (params) => {
    let paramArr = Object.keys(params).map((param) => {
      let value = params[param]
      if (typeof value === "object") {
        value = JSON.stringify(value)
      }

      return `${param}=${value}`
    })
    return `${paramArr.join("&")}`
  },

  // extracts the relevant firebaseData data from the firebase auth data received on login/request
  extractUserData: (firebaseData) => {
    let userData = {
      displayName: firebaseData.displayName,
      email: firebaseData.email,
      photoURL: firebaseData.photoURL,
      uid: firebaseData.uid,
      providerData: firebaseData.providerData,
    }

    return userData
  },
  getBase64: (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        console.log("start of base64", reader.result.slice(0, 15));
        console.log("end of base64", reader.result.slice(-15, -1));
        // remove metadata added to front of string
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        
        return resolve(encoded)
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        return reject(error)
      };
    })
  },

  getTranscriptDataFromParam: (transcriptIdentifier) => {
    const lastModifiedRegex = /.+(-lastModified[0-9]+)$/
    const lastModifiedMatch = transcriptIdentifier.match(lastModifiedRegex)[1]

    // filename is param minus the lastModified suffix
    const encodedFileName = transcriptIdentifier.replace(lastModifiedMatch, "")
    // filename was encoded before being the url, so decode it now to get actual filename

    const lastModified = lastModifiedMatch.replace("-lastModified", "")

    return {lastModified, encodedFileName}
  },

  // looks for match based on filename and file last modified time
  matchingTranscripts: (transcripts, encodedFileName, lastModified) => {
    const transcriptsArr = _.values(transcripts).map(t => new Transcript(t))
    console.log("looking for encoded file name", encodedFileName)
    console.log("and time", lastModified)
    const matches = transcriptsArr ? 
      transcriptsArr.filter(transcript => {
        let encodedTranscriptFilename = transcript.encodedFilename()
        console.log("is this a match?", transcript)
        console.log(encodedTranscriptFilename, transcript.filename)
        console.log("decoded is", decodeURIComponent(encodedTranscriptFilename))
        console.log(transcript.fileLastModified)

        return (
          [
            encodedTranscriptFilename, 
            decodeURIComponent(encodedTranscriptFilename), // for when filename includes Khmer, this is required
          ].includes(encodedFileName)
        ) && transcript.fileLastModified == parseInt(lastModified)
      })
    : []

    return matches
  }, 

  timestamp: () => moment.utc().format("YYYYMMDDTHHmmss[Z]")
}

// for adding more helper files to this one
Helpers = Object.assign(Helpers)

export default Helpers
