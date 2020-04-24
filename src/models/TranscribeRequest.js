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
    if (obj.file) {
      this.file = obj.file

      this.filename = this.file.name
      this.contentType = this.file.type

      this.fileLastModified = this.file.lastModified

      this.fileSize = this.file.size
      this.status = TRANSCRIPTION_STATUSES[0] // no error yet hopefully! but set this if there is one to know what to request next
      this.uploadedAt = null // not yet uploaded to cloud storage, much less anything else
      this.error = null // no error yet hopefully! but set this if there is one to know what to request next

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
      this.uploadedAt = record.uploaded_at 
      this.serverReceivedAt = record.server_received_at
      this.fileProcessedAt = record.file_processed_at
      this.transcriptCompletedAt = record.transcript_completed_at 
      this.transcriptProcessedAt = record.transcript_processed_at 

      this.error = record.error // string
      this.errored_while = record.errored_while // string
      this.multipleErrors = record.multipleErrors // boolean

    } else if (obj.transcript) {
      // TODO don't have this setup, but should, if we originate from something other than the just
      // now uploaded file
    }
    this.filePath = `audio/${this.user.uid}/${this.filename}`
    // TODO also have option if building this class from pulled down file from storage


  }

  async getFile() {
    const result = "TODO"
    this.file = result
  }

  fileStorageRef () {
    const storageRef = firebase.storage().ref()
    const storagePath = storageRef.child(this.filePath)

    return storagePath
  }

  // for now just sending some info via an object.. later a more robust transcript, can definitely
  // set more
  transcript () {
    return new Transcript({
      filename: this.filename || this.file.name, 
      file_last_modified: this.fileLastModified,
    })
  }


  // each transcript will be name spaced by file name and last modified date.
  // If a single file has been uploaded multiple times, will eventually show a list of versions on the side somewhere, which the user can select, but just start by default by showing the last created transcript. TODO
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
    this.status == _.last(TRANSCRIPTION_STATUSES)
  }

  //////////////////////////
  // display helpers
  // ///////////////////
  
  displayFileLastModified () {
    return moment(parseInt(this.fileLastModified)).tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))
  }

  displayLastUpdated () {
    return this.updatedAt ? 
      moment(this.updatedAt, "YYYYMMDDTHHmmss[Z]").tz(moment.tz.guess()).format('MMMM Do YYYY, h:mm:ss a') // moment(this.createdAt, "YYYYMMDDTHHMMss").tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))
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
      const snapshot = await this._upload()
      const fileMetadata = await this.updateRecord()
      return fileMetadata
    
    } catch (err) {
      console.log(`Failed requesting transcript for file ${this.filename}`)
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
      this.uploadedAt = snapshot.metadata.timeCreated
      this.status = TRANSCRIPTION_STATUSES[1] // uploaded

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
      const { file, user, filename, fileLastModified, contentType, filePath, fileSize, status, uploadedAt } = this

      const docName = this.transcriptIdentifier()
      const docRef = db.collection('users').doc(user.uid).collection("transcribeRequests").doc(docName)
      this.updatedAt = moment.utc().format("YYYYMMDDTHHmmss[Z]")

      console.log("updating record in firestore")
      // NOTE maybe should persist more, can add later when we need to do that

      // build out object to send for request to transcribe
      const fileMetadata = { 
        filename,
        file_path: filePath,
        // format like this: "2020-04-19T06:16:20.840Z"
        uploaded_at: uploadedAt, 
        // format like this: "20200419T016208Z"
        updated_at: this.updatedAt,
        file_last_modified: fileLastModified,
        content_type: contentType,
        file_size: fileSize,
        user_id: user.uid,
        status, 
      }

      // sometimes only thing updated will be updated_at time
      await docRef.set(fileMetadata, { merge: true })

      return fileMetadata

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
    // return this.status.includes("error")
  }
}

export default TranscribeRequest
