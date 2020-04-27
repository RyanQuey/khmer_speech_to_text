import { call, put, takeLatest, all } from 'redux-saga/effects'
import {
  UPLOAD_AUDIO_REQUEST,
  UPLOAD_AUDIO_FAILURE,
  UPLOAD_AUDIO_SUCCESS,
  RESUME_TRANSCRIBING_SUCCESS,
  RESUME_TRANSCRIBING_REQUEST,
  RESUME_TRANSCRIBING_FAILURE,
  CHECK_TRANSCRIBING_PROGRESS_REQUEST,
  CHECK_TRANSCRIBING_PROGRESS_SUCCESS,
  CHECK_TRANSCRIBING_PROGRESS_FAILURE,
}  from 'constants/actionTypes'
import { TRANSCRIPTION_STATUSES} from "constants/transcript"
import { errorActions, alertActions, userActions } from 'shared/actions'
import TranscribeRequest from 'models/TranscribeRequest'

// TODO rename to audioUploads instead
// handles the requests to upload file, get untranscribed uploads, and also request transcripts for
// untranscribed uploads

function* uploadAudio(action) {

  let transcribeRequest, fileMetadata

  try {
    const file = action.payload
    transcribeRequest = new TranscribeRequest({file})
    // Have to refresh token every hour or it expires, so call this before hitting cloud functions
    // TODO haven't tested
    yield userActions.setBearerToken()

    // TODO secure storage so requires bearer token
    fileMetadata = yield transcribeRequest.uploadToStorage()

  } catch (err) {
    yield put({type: UPLOAD_AUDIO_FAILURE})
    let httpStatus = err && Helpers.safeDataPath(err, "response.status", 500)
    //these are codes from our api
    let errorCode = err && Helpers.safeDataPath(err, "response.data.originalError.code", 500)
    let errorMessage = err && Helpers.safeDataPath(err, "response.data.originalError.message", 500)
    // TODO probably remove, since we are going to log it earlier in the failure chain
    console.error(errorCode, errorMessage, err && err.response && err.response.data || err);

    errorActions.handleErrors({
      templateName: "UploadAudio",
      templatePart: "form",
      title: "Error Uploading Audio:",
      message: "Please try again",
      errorObject: err,
      alert: true,
    }, null, null, {
      useInvalidAttributeMessage: true,
    })

    _confirmErrorStatus(transcribeRequest, errorMessage)
    action.onFailure && action.onFailure(err)
    return
  }

  try {
    yield axios.post("/request-transcribe/", fileMetadata)

    yield put({type: UPLOAD_AUDIO_SUCCESS, payload: fileMetadata})

    // if transcribing, start polling our server
    const transcribeRequest = new TranscribeRequest({transcribeRequestRecord: fileMetadata})
    // fileMetadata didn't have all the properties attached, so reload first
    transcribeRequest.reload()
    console.log("what is current status?", transcribeRequest)
    // in reality, unless it errored here, I think it should always start polling
    if (transcribeRequest.transcribing()) {
      console.log("should now begin check request polling")
      yield put({type: CHECK_TRANSCRIBING_PROGRESS_REQUEST, payload: transcribeRequest})
    }


    alertActions.closeAlerts()
    alertActions.newAlert({
      //title: response.data.transcription,
      title: "Now creating transcript, please wait",
      level: "SUCCESS",
      options: {timer: true}
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

    errorActions.handleErrors({
      templateName: "UploadAudio",
      templatePart: "form",
      title: "Error Transcribing Audio:",
      message: "Please try again",
      errorObject: err,
      alert: true,
    }, null, null, {
      useInvalidAttributeMessage: true,
    })
    
    _confirmErrorStatus(transcribeRequest, errorMessage)
    action.onFailure && action.onFailure(err)
  }
}

function* requestResume(action) {
  let transcribeRequest


  try {
    transcribeRequest = action.payload
    // Have to refresh token every hour or it expires, so call this before hitting cloud functions
    // TODO haven't tested
    yield userActions.setBearerToken()

    // fileMetadata only has some of the info, but the server will grab the record from firestore before
    // continuing anyways, so it's enough
    // TODO don't update, just do a get from firestore
    const fileMetadata = yield transcribeRequest.getRequestPayload()
      // result tends to just have a message, that's it
    const result = yield axios.post("/resume-request/", fileMetadata)

    yield put({type: RESUME_TRANSCRIBING_SUCCESS, payload: result.data})

    // if transcribing, start polling our server
    // start by reloading to the store (which should also be current state of firestore)
    transcribeRequest.reload()

    let message
    if (transcribeRequest.transcribing()) {
      console.log("should now begin check request polling")
      message = "Now continuing transcription process, please wait"
      yield put({type: CHECK_TRANSCRIBING_PROGRESS_REQUEST, payload: transcribeRequest})

    } else {
      // TODO more descriptive messages for user
      message = "Resuming"
    }

    alertActions.closeAlerts()
    alertActions.newAlert({
      //title: response.data.transcription,
      title: "Success",
      message,
      level: "SUCCESS",
      options: {timer: true}
    })

    action.cb && action.cb(transcribeRequest)

  } catch (err) {
    yield put({type: RESUME_TRANSCRIBING_FAILURE})
    let httpStatus = err && Helpers.safeDataPath(err, "response.status", 500)
    //these are codes from our api
    let errorCode = err && Helpers.safeDataPath(err, "response.data.originalError.code", 500)
    let errorMessage = err && Helpers.safeDataPath(err, "response.data.originalError.message", 500)
    // TODO probably remove, since we are going to log it earlier in the failure chain
    console.error("failed to resume transcription");
    console.error(errorCode, errorMessage, err && err.response && err.response.data || err);

    errorActions.handleErrors({
      templateName: "UploadAudio",
      templatePart: "form",
      title: "Error Resuming Transcription:",
      message: "Please try again",
      errorObject: err,
      alert: true,
    }, null, null, {
      useInvalidAttributeMessage: true,
    })

    _confirmErrorStatus(transcribeRequest, errorMessage)
    action.onFailure && action.onFailure(err)
  }
}

function* checkStatus(action) {
  let transcribeRequest

  try {
    transcribeRequest = action.payload
    // Have to refresh token every hour or it expires, so call this before hitting cloud functions
    // TODO haven't tested
    yield userActions.setBearerToken()

    // fileMetadata only has some of the info, but the db will grab the record from firestore before
    // continuing anyways, so it's enough
    // TODO don't update, just do a get from firestore
    const fileMetadata = yield transcribeRequest.getRequestPayload()
    const result = yield axios.post("/check-status/", fileMetadata)

    yield put({type: CHECK_TRANSCRIBING_PROGRESS_SUCCESS, payload: result})

    if (Helpers.safeDataPath(result, "data.current_request_data.status") == "transcribing") {
      // TODO make sure this NEVER overlaps with another request to our server, so don't get a
      // single record all mixed up
      console.log("not finished so try again")
      // try again
      setTimeout(function(){ 
        console.log("trying again NOW")
        store.dispatch({type: CHECK_TRANSCRIBING_PROGRESS_REQUEST, payload: action.payload})
      }, 750);

    }

    action.cb && action.cb(transcribeRequest)

  } catch (err) {
    yield put({type: CHECK_TRANSCRIBING_PROGRESS_FAILURE})
    let httpStatus = err && Helpers.safeDataPath(err, "response.status", 500)
    //these are codes from our api
    let errorCode = err && Helpers.safeDataPath(err, "response.data.originalError.code", 500)
    let errorMessage = err && Helpers.safeDataPath(err, "response.data.originalError.message", 500)
    // TODO probably remove, since we are going to log it earlier in the failure chain
    console.error(errorCode, errorMessage, err && err.response && err.response.data || err);

    errorActions.handleErrors({
      templateName: "UploadAudio",
      templatePart: "form",
      title: "Error Resuming Transcription:",
      message: "Please try again",
      errorObject: err,
      alert: true,
    }, null, null, {
      useInvalidAttributeMessage: true,
    })

    _confirmErrorStatus(transcribeRequest, errorMessage)
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

// make sure that this has the appropriate error set
async function _confirmErrorStatus (transcribeRequest, errorMessage = "Unknown error") {
  // TODO haven't defined
  await transcribeRequest.reload()

  if (!transcribeRequest.status.includes("error")) {
    // if no error, then update status
    console.error("Have to log this error, the server didn't get it")

    await transcribeRequest.logEvent(TRANSCRIPTION_STATUSES[6], {
      otherInEvent: {error: errorMessage}
    }) // server-error
  }
}

///////////////////////
// EXPORTS
export default function* audioSaga() {
  yield takeLatest(UPLOAD_AUDIO_REQUEST, uploadAudio)
  yield takeLatest(RESUME_TRANSCRIBING_REQUEST, requestResume)
  yield takeLatest(CHECK_TRANSCRIBING_PROGRESS_REQUEST, checkStatus)
}
