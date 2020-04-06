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

  // each transcript will be name spaced by file name and last modified date.
  // If a single file has been uploaded multiple times, will eventually show a list of versions on the side somewhere, which the user can select, but just start by default by showing the last created transcript. TODO
  transcriptUrl: (transcript) => (
    `/transcripts/${transcript.filename}-${transcript.fileLastModified}`
  ),

  transcriptUrlForFile: (file) => (
    `/transcripts/${file.name}-${file.lastModified}`
  ),
}

// for adding more helper files to this one
Helpers = Object.assign(Helpers)

export default Helpers
