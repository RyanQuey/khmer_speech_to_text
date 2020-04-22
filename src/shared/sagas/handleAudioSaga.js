import { call, put, takeLatest, all } from 'redux-saga/effects'
import {
  UPLOAD_AUDIO_REQUEST,
  UPLOAD_AUDIO_FAILURE,
  UPLOAD_AUDIO_SUCCESS,
}  from 'constants/actionTypes'
import { errorActions, alertActions, userActions } from 'shared/actions'
import TranscribeRequest from 'models/TranscribeRequest'

// TODO rename to audioUploads instead
// handles the requests to upload file, get untranscribed uploads, and also request transcripts for
// untranscribed uploads

function* uploadAudio(action) {

  try {
    const file = action.payload
    const transcribeRequest = new TranscribeRequest({file})
    // Have to refresh token every hour or it expires, so call this before hitting cloud functions
    // TODO haven't tested
    yield userActions.setBearerToken()

    // TODO secure storage so requires bearer token
    const fileMetadata = yield transcribeRequest.uploadToStorage()

    yield axios.post("/request-transcribe/", fileMetadata)

    yield put({type: UPLOAD_AUDIO_SUCCESS, payload: fileMetadata})

    alertActions.closeAlerts()
    alertActions.newAlert({
      //title: response.data.transcription,
      title: "Now creating transcript, please wait",
      level: "SUCCESS",
      options: {timer: false}
    })

    action.cb && action.cb(transcribeRequest)

  } catch (err) {
    yield put({type: UPLOAD_AUDIO_FAILURE})
    let httpStatus = err && Helpers.safeDataPath(err, "response.status", 500)
    //these are codes from our api
    let errorCode = err && Helpers.safeDataPath(err, "response.data.originalError.code", 500)
    let errorMessage = err && Helpers.safeDataPath(err, "response.data.originalError.message", 500)
    // TODO probably remove, since we are going to log it earlier in the failure chain
    console.error(errorCode, errorMessage, err && err.response && err.response.data || err);

    // TODO fix these (outdated)
    if (httpStatus === 403) {
      alertActions.newAlert({
        title: "Invalid email or password",
        message: "Please try again",
        level: "WARNING",
        options: {timer: false},
      })

    } else {
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


///////////////////////
// EXPORTS
export default function* audioSaga() {
  yield takeLatest(UPLOAD_AUDIO_REQUEST, uploadAudio)
}
