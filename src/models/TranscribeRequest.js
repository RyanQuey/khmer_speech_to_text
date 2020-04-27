import { TRANSCRIPTION_STATUSES} from "constants/transcript"
import { 
  UPDATE_TRANSCRIBE_REQUEST_STATUS_REQUEST,
  UPDATE_TRANSCRIBE_REQUEST_STATUS_SUCCESS,
} from "constants/actionTypes"
import Transcript from 'models/Transcript'

// TODO create model class, with stuff for schema etc
// TODO use REDUX with more throughout the transcription lifecycle
//class File extends Model {
// takes transcript from firestore record (uses underscored keys from the api) 
class TranscribeRequest {
  constructor(obj = {}) {
    // super()

    // assign keys and values from transcript to this

    // for when getting a just-now uploaded-to-browser of web File class 
    // (not yet uploaded to cloud storage, or if it is, make sure to override status)
    this.user = store.getState().user
    this._setPropsFromObj(obj)
    // TODO also have option if building this class from pulled down file from storage
  }

  _setPropsFromObj (obj) {
    if (obj.file) {
      this.file = obj.file

      this.filename = this.file.name
      this.fileType = this.file.type

      this.fileLastModified = this.file.lastModified

      this.fileSize = this.file.size
      // uploading
      this.logEvent(TRANSCRIPTION_STATUSES[0], {skipPersist: true})

    } else if (obj.transcribeRequestRecord) {
      let record = obj.transcribeRequestRecord
      this.id = record.id
      this.file = null // if want it, need to go get it `this.getFile()`
      this.filename = record.filename
      this.fileType = record.file_type

      this.fileLastModified = record.file_last_modified
      this.fileSize = record.file_size
      this.filePath = record.file_path
      this.originalFilePath = record.original_file_path
      this.transactionId = record.transaction_id
      this.updatedAt = record.updated_at 

      this.status = record.status
      this.error = record.error

    } else if (obj.transcript) {
      // TODO don't have this setup, but should, if we originate from something other than the just
      // now uploaded file
    }

    this.filePath = `audio/${this.user.uid}/${this.filename}`
  }

  //////////////////////////////
  // getters/setters
  // ////////////////////

  // for when contstructed from a non-file
  async getFile() {
    const result = "TODO"
    this.file = result
  }

  fileStorageRef () {
    const storageRef = firebase.storage().ref()
    const storagePath = storageRef.child(this.filePath)

    return storagePath
  }

  docRef (options = {}) {
    const collectionRef = db.collection("users").doc(this.user.uid).collection("transcribeRequests")
    let docRef
    if (options.newDoc) {
      docRef = collectionRef.doc()
      this.id = docRef.id

    } else {

      docRef = collectionRef.doc(this.id)
    }

    return docRef
  }
  // for now just sending some info via an object.. later a more robust transcript, can definitely
  // set more
  transcript () {
    return new Transcript({
      filename: this.filename || this.file.name, 
      file_last_modified: this.fileLastModified,
    })
  }

  transcriptUrl () {
    const t = this.transcript()

    return t.showViewUrl()
  }

  transcriptIdentifier () {
    const t = this.transcript()

    return t.identifier()
  }

  // returns latest first
  logsRef () {
    return this.docRef().collection("eventLogs").orderBy("time", "desc")
  }
  // for requests for firestore AND to our own API, this is the essential data we are sending
  getRequestPayload () {
    const { id, error, user, filename, fileLastModified, fileType, filePath, fileSize } = this
    const fileMetadata = { 
      id,
      filename,
      file_path: filePath,
      // format like this: "20200419T016208Z"
      file_last_modified: fileLastModified,
      file_type: fileType,
      file_size: fileSize,
      user_id: user.uid,
      // most of the time this is the only thing that gets changed in all this. 
      status: this.getStatus(),
      error,
    }

    return fileMetadata
  }

  sizeInMB() {
    return parseFloat(this.fileSize) / 1048576
  }

  elapsedSinceLastEvent() {
    const updatedAt = moment(this.updatedAt, "YYYYMMDDTHHmmss[Z]")
    const now = moment()

    const elapsedTime = now.diff(updatedAt, "seconds")

    return elapsedTime
  }

  // low level thing, don't call directly much. Don't want to set eventLogs to this record in order
  // to not confuse things
  // TODO make separate model for event logs in order to be able to interact with them
  async getEventLogs () {
    const logs = await this.logsRef().get()

    return logs
  }

  // should return obj with property "error" that is same as this.error, unless data is corrupted
  async getLastError () {
    const logs = await this.getEventLogs()
    const errorLogs = logs.filter(l => l.event.includes("error"))

    return _.last(errorLogs)
  }
  ///////////////////////////////////
  // reading/setting/interacting with status
  ////////////////////////////////
  
  // event should be string
  // can be async or syncrounous depending on options
  logEvent (event, options = {}) {
    const eventLog = Object.assign({
      event,
      time: Helpers.timestamp(),
    }, options.otherInEvent)

    if (Helpers.safeDataPath(options, "otherInEvent.error")) {
      this.error = options.otherInEvent.error
    } else {
      this.error = ""
    }

    // since eventLogs is a separate collection, persisting status on the local record as well for ease of access
    this.status = event

    // always skip persist if haven't created record in db yet, just save afterwards. Or if want to
    // do synchronous
    if (!options.skipPersist) {
      // TODO wrap this in transaction, and make sure the updatedAt time is the same
      store.dispatch({
        type: UPDATE_TRANSCRIBE_REQUEST_STATUS_REQUEST, 
        payload: event,
      })
      
      // NOTE returns a promise that finishes when both are done

      return Promise.all([
        this.logsRef().add(eventLog), 
        this.updateRecord()
      ]).then(r => {
        store.dispatch({
          type: UPDATE_TRANSCRIBE_REQUEST_STATUS_SUCCESS, 
          payload: event,
        })
      })
    }
  }

  // each transcript will be name spaced by file name and last modified date.
  // If a single file has been uploaded multiple times, will eventually show a list of versions on the side somewhere, which the user can select, but just start by default by showing the last crea transcriptted transcript. TODO
  // make a mock transcript object based on the file, selecting keys based on what the transcript will have
  transcribing () {
    return this.getStatus() == TRANSCRIPTION_STATUSES[3]
  }

  // processing the transcript received from Google
  // TODO give less ambiguous name, since we use this var name for processing the file before
  // sending to Google as well
  processing () {
    return this.getStatus() == TRANSCRIPTION_STATUSES[4]
  }

  transcriptionComplete () {
    return this.getStatus() == TRANSCRIPTION_STATUSES[5]
  }

  hasError () {
    return [TRANSCRIPTION_STATUSES[6], TRANSCRIPTION_STATUSES[7]].includes(this.getStatus())
  }

  hasTranscribingError () {
    return this.getStatus() == TRANSCRIPTION_STATUSES[6]
  }
  hasServerError () {
    return this.getStatus() == TRANSCRIPTION_STATUSES[6]
  }

  hasTranscribingError () {
    return this.getStatus() == TRANSCRIPTION_STATUSES[6]
  }
  getStatus (options = {}) {
    // NOTE need to retrieve eventLogs if haven't already
    // TODO allow checking with eventlogs if an option is passed in, otherwise just trust the record
    // return _.last(this.eventLogs || [])
    return this.status
  } 

  // if retruns true, it means that we're allowing users to request a retry
  canRetryMessage () {

    // if errored, check what the error is
    if (this.hasError()) {
      // TODO will always have this.error in future of hasError hopefully
      if (!this.error) {
        // if for no other reason than to get that error property set...
        return "can-retry"

      } else if (this.error && this.error.includes("404 No such object")) {
        console.log("file is missing")
      // E.g., "404 No such object: khmer-speech-to-text.appspot.com/audio/rBBGZxzo3EOUtTJOFkARSf2qxd73/temp-audio.flac"
        // TODO for these, include a button to reupload, and then attach it to current transcribe
        // request (rather than creating a new one)
        return "file-missing"
      } else {
        // TODO add more retryable errors
        return "unretryable-error"
      }

      
    } else if (this.lastRequestHasStopped()) {
      console.log("last request has stopped")
      // if no errored,  make sure that they wait long enough
      return "can-retry"

    } else {
      return "please-wait"
    }
  }

  // NOTE this is just a reasonable guess based on time passed, for use with retrying
  lastRequestHasStopped () {
    // copying what we have in server, so user doesn't ask for something we aren't going to handle anyway
    // see notes in server for why these times
    const status = this.status
    const elapsedTime = this.elapsedSinceLastEvent()
    if (status == TRANSCRIPTION_STATUSES[0]) { // uploading
        // assumes at least 1/5 MB / sec internet connection (except for that 100 = 1 min...)
        return elapsedTime > this.sizeInMB() * 5

    } else if (status == TRANSCRIPTION_STATUSES[1]) { // uploaded
        return elapsedTime > 200

    } else if (status == TRANSCRIPTION_STATUSES[2]) { // processing-file (aka server has received)
        // takes longer if have to transcode from whatever > flac. Otherwise, only have some quick variable setting (much less than 1 sec), some firestore calls, and a quick roundtrip request to Google's API that confirms they started the transcript, and we should be marking as transcribing
      if (this.file_extension != "flac") {
        return elapsedTime > (100 + this.sizeInMB() * 10)

      } else {
        return 100
      }

    } else if (status == TRANSCRIPTION_STATUSES[3]) { // transcribing
        // could take awhile. But a 25 MB sized file should not take 7 min (which would be 100 + size * 25) so doubling that should be plenty
        return elapsedTime > (100 + this.sizeInMB() * 50)

    } else if (status == TRANSCRIPTION_STATUSES[4]) { // "processing-transcription" (means that transcription is complete)
        // should be pretty fast, just iterate over transcript, some var setting, set to firestore a few times, and ret
        return elapsedTime > (100 + this.sizeInMB() * 1)

    } else if (status == TRANSCRIPTION_STATUSES[5]) { // "transcription-processed"
        // stopped because done
        return true

    } else if (status == TRANSCRIPTION_STATUSES[6]) { // server-error
        return true

    } else if (status == TRANSCRIPTION_STATUSES[7]) { // transcribing-error
        return true
    }
  }

  //////////////////////////
  // display helpers
  // ///////////////////
  
  displayFileLastModified () {
    return moment(parseInt(this.fileLastModified)).tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))
  }

  displayLastUpdated () {
    return this.updatedAt ? 

      moment.utc(this.updatedAt, "YYYYMMDDTHHmmss[Z]").tz(moment.tz.guess()).format('MMMM Do YYYY, h:mm:ss a') // moment(this.createdAt, "YYYYMMDDTHHMMss").tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))
      : "Not yet uploaded"
  }

  displayFileSize () {
    return `${(this.fileSize / 1048576).toFixed(2)} MB`
  }

  displayCanRetryMessage () {
    const message = this.canRetryMessage()
    const obj = {
      "file-missing": "File can no longer be found in storage; please upload file again and start over",
      "unretryable-error": "Unknown Error: Cannot handle this file for unknown reasons",
      "can-retry": "Press to request transcript",
      "please-wait": "We are still processing your file, please wait",
    }

    return obj[message]
  }
  // /////////////////////////
  // Async stuff
  // //////////////////////
  async uploadToStorage() {
    try {
      // set to status uploading, and persist for the first time
      this.logEvent(TRANSCRIPTION_STATUSES[0], {skipPersist: true}) // uploading
      await this.updateRecord()

      const snapshot = await this._upload()
      const fileMetadata = this.getRequestPayload()
      return fileMetadata
    
    } catch (err) {
      console.error(`Failed uploading file ${this.filename} to cloud storage`, err)
      throw err
    }
  }
  
  // TODO check storage first before trying to upload, no need to download the file. If it's
  // possible in the google storage api
  async _upload (){
    try {
      const { file, fileLastModified, fileType } = this
      const metadata = {
        contentType: fileType,
        customMetadata: {fileLastModified}
      };

      const snapshot = await this.fileStorageRef().put(this.file, metadata)
      // could do it firestore way:
      //but this way is consistent with our api
      this.logEvent(TRANSCRIPTION_STATUSES[1], {skipPersist: true}) // uploaded

      return snapshot

    } catch (err) {
      console.error('error uploading to storage: ', err)
      // throw it up the chain
      throw err
    }
  }
  
  // creates/updates record to track status of the transcription transaction in Google cloud api
  async updateRecord (){
    try {
      this.updatedAt = moment.utc().format("YYYYMMDDTHHmmss[Z]")

      // should have all the things we might possibly want to update
      // TODO maybe better for func to just accept a payload obj, so don't have to persist so much.
      let docRef = this.docRef({newDoc: !this.id})

      // make sure to request docRef first, in case we need to set the id
      const updates = this.getRequestPayload()
      // if it's creating a record, get an id and keep it in browser and in firestore


      await docRef.set(updates, { merge: true })

      return updates

    } catch (err) {
      console.error('error creating record of transcribe request: ', err)
      // throw it up the chain
      throw err
    }
  }

  canRetry () {
    return ["can-retry"].includes(this.canRetryMessage())
  }

  reload () {
    // we are live reloading from fire store all the time, so all we need to do is find the record
    // in our store and refresh from there
    const { transcribeRequests } = store.getState()
    const match = _.values(transcribeRequests).find((t) => (t.id == this.id))

    this._setPropsFromObj({transcribeRequestRecord: match})
  }
}

export default TranscribeRequest
