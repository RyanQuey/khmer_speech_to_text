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
      this.error = null // no error yet hopefully! but set this if there is one to know what to request next
      this.status = TRANSCRIPTION_STATUSES[0] // no error yet hopefully! but set this if there is one to know what to request next
      this.uploadedAt = null // not yet uploaded to cloud storage
      this.receivedByServerAt = null 
      this.beganTranscribingAt = null 
      this.transcriptCompletedAt = null // not yet uploaded to cloud storage
      this.transcriptProcessedAt = null // not yet uploaded to cloud storage

    } else if (obj.transcribeRequestRecord) {
      let record = obj.transcribeRequestRecord
      this.file = null // if want it, need to go get it `this.getFile()`
      this.filename = record.filename
      this.contentType = record.content_type

      this.fileLastModified = record.file_last_modified
      this.fileSize = record.file_size
      this.status = record.status
      this.error = record.error // no error yet hopefully! but set this if there is one to know what to request next
      this.uploadedAt = record.uploaded_at // not yet uploaded to cloud storage
      this.receivedByServerAt = record.received_by_server_at
      this.beganTranscribingAt = record.began_transcribing_it
      this.transcriptCompletedAt = record.transcript_completed_at // not yet uploaded to cloud storage
      this.transcriptProcessedAt = record.transcript_processed_at // not yet uploaded to cloud storage

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
      filename: this.file.name, 
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

  displayFileLastModified () {
    return moment(parseInt(this.fileLastModified)).tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))
  }

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
  // NOTE only runs if file is untranscribed
  async updateRecord (){
    try {
      const { file, user, filename, fileLastModified, contentType, filePath, fileSize, status, uploadedAt } = this

      if (this.transcriptionComplete()) {
        console.log("not setting; transcription is already complete")
        return
      }

      const docName = this.transcriptIdentifier()
      const docRef = db.collection('users').doc(user.uid).collection("transcribeRequests").doc(docName)

      // build out object to send for request to transcribe
      const fileMetadata = { 
        filename,
        file_path: filePath,
        // format like this: "2020-04-19T06:16:20.840Z"
        uploaded_at: uploadedAt, 
        file_last_modified: fileLastModified,
        content_type: contentType,
        file_size: fileSize,
        user_id: user.uid,
        status, 
      }

      await docRef.set(fileMetadata)

      return fileMetadata

    } catch (err) {
      console.error('error creating record of untranscribed upload to storage: ', err)
      // throw it up the chain
      throw err
    }
  }

  displayFileSize () {
    return `${(this.fileSize / 1048576).toFixed(2)} MB`
  }

}

export default TranscribeRequest
