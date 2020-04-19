import { call, put, takeLatest, all } from 'redux-saga/effects'
import {
  UPLOAD_AUDIO_REQUEST,
  UPLOAD_AUDIO_FAILURE,
  UPLOAD_AUDIO_SUCCESS,
}  from 'constants/actionTypes'
//import { setupSession } from 'lib/socket' // Not using a socket
import { errorActions, alertActions, userActions } from 'shared/actions'

// using fetch
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      //'Content-Type': 'application/json'
      //'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
    body: data // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

// TODO add something that automatically refreshes token or something every so often. Or find some solution for where that's not necessary
function* uploadAudio(action) {

  try {
    const file = action.payload
    // TODO since cloud functions are so slow, just don't wait for it, and return success
    // NOTE cloud functions are so slow, not doing alerts, just send out HTTP request and wait for listener to detect results

    // NOTE No longer sending as base 64, since current quotas that if a file is over one minute, it needs to be uploaded as an entire file and sent in as a URI
    //const response = _sendBase64(file)

    // will have to refresh this every hour or it expires, so call this before hitting cloud functions
    // TODO haven't tested
    yield userActions.setBearerToken()

    // TODO secure storage so requires bearer token
    const fileMetadata = yield _uploadToStorage(file)
    console.log("hit that endpoint!", fileMetadata)
    yield axios.post("/request-transcribe/", fileMetadata)
    console.log("moving on...!")

    yield put({type: UPLOAD_AUDIO_SUCCESS, payload: fileMetadata})
    alertActions.newAlert({
      //title: response.data.transcription,
      title: "Now creating transcript, please wait",
      level: "SUCCESS",
      options: {timer: false}
    })

    action.cb && action.cb(file)

  } catch (err) {
    yield put({type: UPLOAD_AUDIO_FAILURE})
    let httpStatus = err && Helpers.safeDataPath(err, "response.status", 500)
    //these are codes from our api
    let errorCode = err && Helpers.safeDataPath(err, "response.data.originalError.code", 500)
    let errorMessage = err && Helpers.safeDataPath(err, "response.data.originalError.message", 500)
    console.error(errorCode, errorMessage, err && err.response && err.response.data || err);

    // TODO fix these (outdated)
    if (httpStatus === 403) {
      alertActions.newAlert({
        title: "Invalid email or password",
        message: "Please try again",
        level: "WARNING",
        options: {timer: false},
      })

    } else if (errorCode === "unregistered-email" ){
      //not in our api to be accepted
      alertActions.newAlert({
        title: "Your account has not been registered in our system: ",
        message: "Please contact us at hello@growthramp.io to register and then try again.",
        level: "DANGER",
        options: {timer: false},
      })

      // TODO will be different error code at this point
    } else if (errorCode == "23505" ){ //original error.constraint should be "users_email_unique". Works because there are no other unique constraints sent by this form
      alertActions.newAlert({
        title: "Email already exists: ",
        message: "Please try logging in instead, or reset your password if you have forgotten it.",
        level: "DANGER",
        options: {timer: false},
      })

    } else {
      console.error('Error uploading audio', err)
      errorActions.handleErrors({
        templateName: "UploadAudio",
        templatePart: "form",
        title: "Error Uploading Audio:",
        errorObject: err,
        alert: true,
      }, null, null, {
        useInvalidAttributeMessage: true,
      })
    }
    action.onFailure && action.onFailure(err)

  }
}

//////////////////////////////
// HELPERS 
// takes a file with File web api, converts it to base 64, and sends the base 64 to our cloud functions server which will send it to the Google speech to text API
async function _sendBase64 (file) {
  const base64 = await Helpers.getBase64(file); // prints the base64 string
  // later, can conditionally send large files elsewhere by doing something like: file.size < 1.5*1000

  let response
  // if less than 1.5MB (about 1 min for mp3 file), can do normal recognize, if longer do long recognize
  // base64 for 12 sec file was .length 415820
  const body = { 
    base64, 
    fileType: file.type,
    filename: file.name,
    fileSize: file.size,
    fileLastModified: file.lastModified,
  }
  //response = yield axios.post(`/app/upload-audio/`, body)
  response = await axios.post(`/app/upload-audio/`, body)

  return response
};

async function _uploadToStorage(file) {
  try {
    const { user } = store.getState()
    const path = user.uid
    const fileLastModified = file.lastModified
    const audioName = file.name
    const contentType = file.type
    // Create file metadata including the content type
    var metadata = {
      contentType,
      customMetadata: {fileLastModified}
    };

    const storageRef = firebase.storage().ref()
    // temporarily upload to storage, will remove once finished transcribing
    const filePath = `audio/${path}/${audioName}`
    const storagePath = storageRef.child(filePath)

    const snapshot = await storagePath.put(file, metadata)

    // TODO move this to api server, so it's all done at once
    const docRef = db.collection('users').doc(user.uid).collection("untranscribedUploads")

    // build out object to send for request to transcribe
    const fileMetadata = { 
      filename: audioName,
      file_path: filePath,
      // format like this: "2020-04-19T06:16:20.840Z"
      uploaded_at: snapshot.metadata.timeCreated, 
      file_last_modified: fileLastModified,
      content_type: contentType,
      file_size: file.size,
      user_id: user.uid,
    }

    const response = await docRef.add(fileMetadata)
    console.log("response from adding to firestore:", response)

    return fileMetadata
  
  } catch (err) {
    console.error('error uploading to storage: ', err)
  }
}

///////////////////////
// EXPORTS
export default function* audioSaga() {
  yield takeLatest(UPLOAD_AUDIO_REQUEST, uploadAudio)
}
