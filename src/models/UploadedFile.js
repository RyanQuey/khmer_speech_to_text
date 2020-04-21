import { TRANSCRIPTION_STATUSES} from "constants/transcript"

// TODO create model class, with stuff for schema etc
//class File extends Model {
// takes transcript from firestore record (uses underscored keys from the api) 
class UploadedFile {
  constructor(obj = {}) {
    // super()

    // assign keys and values from transcript to this

    // for when getting a just-now uploaded file of web File class
    if (obj.file) {
      this.file = obj.file
      this.user = store.getState().user
      this.filename = this.file.name
      this.contentType = this.file.type

      this.fileLastModified = this.file.lastModified

      this.filePath = `audio/${this.user.uid}/${this.filename}`

      this.fileSize = this.file.size
      this.error = null // no error yet hopefully! but set this if there is one to know what to request next
    } else if (obj.fileData) {
      // TODO don't have this setup, but should, if we originate from something other than the just
      // now uploaded file
    }
    // TODO also have option if building this class from pulled down file from storage


  }

  fileStorageRef () {
    const storageRef = firebase.storage().ref()
    const storagePath = storageRef.child(this.filePath)
  }

  // for now just sending some info via an object.. later a more robust transcript, can definitely
  // set more
  trancsriptForFile () {
    return new Transcript({
      filename: this.file.name, 
      file_last_modified: this.fileLastModified,
    })
  }


  // each transcript will be name spaced by file name and last modified date.
  // If a single file has been uploaded multiple times, will eventually show a list of versions on the side somewhere, which the user can select, but just start by default by showing the last created transcript. TODO
  // make a mock transcript object based on the file, selecting keys based on what the transcript will have
  transcriptUrlForFile (file) {
    const t = this.trancsriptForFile()

    return t.showViewUrl()
  }

  transcriptIdentifierForFile () {
    const t = this.trancsriptForFile()

    return t.identifier()
  }

  async uploadToStorage() {
    try {
      const snapshot = await this._upload()
      const fileMetadata = await this._createTranscribeTransactionRecord(snapshot)
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

      return snapshot

    } catch (err) {
      console.log('error uploading to storage: ', err)
      // throw it up the chain
      throw err
    }
  }
  
  // creates record to track status of the transcription transaction in Google
  // set record in Firestore
  async _createTranscribeTransactionRecord (snapshot){
    try {
      const { file, user, filename, fileLastModified, contentType, filePath, fileSize } = this

      // TODO move this to api server, so it's all done at once
      const docName = this.transcriptIdentifierForFile()
      const docRef = db.collection('users').doc(user.uid).collection("untranscribedUploads").doc(docName)

      // build out object to send for request to transcribe
      const fileMetadata = { 
        filename,
        file_path: filePath,
        // format like this: "2020-04-19T06:16:20.840Z"
        uploaded_at: snapshot.metadata.timeCreated, 
        file_last_modified: fileLastModified,
        content_type: contentType,
        file_size: fileSize,
        user_id: user.uid,
        status: TRANSCRIPTION_STATUSES[0], 
      }

      const response = await docRef.set(fileMetadata)

      return fileMetadata

    } catch (err) {
      console.error('error creating record of upload to storage: ', err)
      // throw it up the chain
      throw err
    }
  }

}

export default UploadedFile
