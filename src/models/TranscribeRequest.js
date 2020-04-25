import { TRANSCRIPTION_STATUSES} from "constants/transcript"
import Transcript from 'models/Transcript'

// TODO create model class, with stuff for schema etc
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
      this.contentType = this.file.type

      this.fileLastModified = this.file.lastModified

      this.fileSize = this.file.size
      // uploading
      this.logEvent(TRANSCRIPTION_STATUSES[0], {skipPersist: true})

    } else if (obj.transcribeRequestRecord) {
      let record = obj.transcribeRequestRecord
      this.file = null // if want it, need to go get it `this.getFile()`
      this.filename = record.filename
      this.contentType = record.content_type

      this.fileLastModified = record.file_last_modified
      this.fileSize = record.file_size
      this.filePath = record.file_path
      this.originalFilePath = record.original_file_path
      this.transactionId = record.transaction_id
      this.updatedAt = record.updated_at 

      this.status = record.status
      this.id = record.id

    } else if (obj.transcript) {
      // TODO don't have this setup, but should, if we originate from something other than the just
      // now uploaded file
    }

    this.filePath = `audio/${this.user.uid}/${this.filename}`
  }

  //////////////////////////////
  // getters/setters
  // ////////////////////
  async getEventLogs() {
    const result = "TODO"
    this.file = result
  }

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
    console.log("Options", options)
    let docRef
    if (options.newDoc) {
      console.log("getting new doc")
      docRef = collectionRef.doc()
      this.id = docRef.id
      console.log("get id", this.id, docRef)

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

  // event should be string
  // can be async or syncrounous depending on options
  logEvent (event, options = {}) {
    const eventLog = {
      event,
      time: Helpers.timestamp(),
    }
    if (options.otherInEvent) {
      Object.assign(eventLog, options.otherInEvent)
    }

    if (!this.eventLogs) {
      this.eventLogs = []
    }

    // TODO set up setters so can't change eventLog without changing status, and vice versa
    this.eventLogs.push(eventLog)
    // since eventLogs is a separate collection, persist something on the local record as well for
    // ease of access
    this.status = event

    // always skip persist if haven't created record in db yet, just save afterwards. Or if want to
    // do synchronous
    if (!options.skipPersist) {
      // TODO wrap this in transaction, and make sure the updatedAt time is the same
      const logsRef = this.docRef().collection("eventLogs")
      this.updateRecord()

      // NOTE returns a promise
      return logsRef.add(eventLog)
    }
  }

  // each transcript will be name spaced by file name and last modified date.
  // If a single file has been uploaded multiple times, will eventually show a list of versions on the side somewhere, which the user can select, but just start by default by showing the last crea transcriptted transcript. TODO
  // make a mock transcript object based on the file, selecting keys based on what the transcript will have
  transcriptUrl () {
    const t = this.trancsript()

    return t.showViewUrl()
  }

  transcriptIdentifier () {
    const t = this.transcript()

    return t.identifier()
  }

  transcriptionComplete () {
    return this.getStatus() == TRANSCRIPTION_STATUSES[5]
  }

  getStatus (options = {}) {
    // NOTE need to retrieve eventLogs if haven't already
    // TODO allow checking with eventlogs if an option is passed in, otherwise just trust the record
    // return _.last(this.eventLogs || [])
    return this.status
  } transcript

  // for requests for firestore AND to our own API, this is the essential data we are sending
  getRequestPayload () {
    const { file, user, filename, fileLastModified, contentType, filePath, fileSize, id } = this
    const fileMetadata = { 
      filename,
      file_path: filePath,
      // format like this: "20200419T016208Z"
      file_last_modified: fileLastModified,
      content_type: contentType,
      file_size: fileSize,
      user_id: user.uid,
      // most of the time this is the only thing that gets changed in all this. 
      status: this.getStatus(),
      id,
    }

    return fileMetadata
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

  // /////////////////////////
  // Async stuff
  // //////////////////////
  async uploadToStorage() {
    try {
      // set to status uploading, and persist for the first time
      console.log("about to log event")
      this.logEvent(TRANSCRIPTION_STATUSES[0], {skipPersist: true}) // uploading
      console.log("about to persist record with the first time")
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
      const { file, fileLastModified, contentType } = this
      const metadata = {
        contentType,
        customMetadata: {fileLastModified}
      };

      const snapshot = await this.fileStorageRef().put(this.file, metadata)
      // could do it firestore way:
      //but this way is consistent with our api
      this.logEvent(TRANSCRIPTION_STATUSES[1], {skipPersist: true}) // uploaded

      return snapshot

    } catch (err) {
      console.log('error uploading to storage: ', err)
      // throw it up the chain
      throw err
    }
  }
  
  // creates/updates record to track status of the transcription transaction in Google cloud api
  async updateRecord (){
    try {
      const { file, user, filename, fileLastModified, contentType, filePath, fileSize } = this

      this.updatedAt = moment.utc().format("YYYYMMDDTHHmmss[Z]")

      // should have all the things we might possibly want to update
      // TODO maybe better for func to just accept a payload obj, so don't have to persist so much.
      let docRef = this.docRef({newDoc: !this.id})

      // make sure to request docRef first, in case we need to set the id
      const updates = this.getRequestPayload()
      // if it's creating a record, get an id and keep it in browser and in firestore


      console.log("updating record in firestore")
      await docRef.set(updates, { merge: true })

      return updates

    } catch (err) {
      console.error('error creating record of transcribe request: ', err)
      // throw it up the chain
      throw err
    }
  }

  // TODO need to make this a lot more robust, variable upon error, error status, last time
  // transcribeRequest was updated, etc
  requestable () {
    return true
    // return this.getStatus().includes("error")
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
