import { TRANSCRIPTION_STATUSES} from "constants/transcript"

// TODO create model class, with stuff for schema etc
//class Transcript extends Model {
// takes transcript from firestore record (uses underscored keys from the api) 
class Transcript {
  constructor(transcriptData) {
    // super()

    // assign keys and values from transcript to this

    this.fileLastModified = transcriptData.file_last_modified
    this.createdAt = transcriptData.transcript_metadata.last_updated_at
    this.filePath = transcriptData.file_path
    this.fileSize = transcriptData.file_size
    this.fileType = transcriptData.content_type
    this.transactionId = transcriptData.transaction_id
    this.userId = transcriptData.user_id
    this.filename = transcriptData.filename
    this.utterances = transcriptData.utterances
    this.uploaded_at = transcriptData.uploaded_at
  }

  // no bells and whistles, just thir 
  simpleTranscriptionText () {
    const { utterances } = this
    // TODO don't just take the first alternative, check confidences, or make sure they are in the correct order at this point
    const transcription = utterances
      .map(utterance => utterance.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);

    return transcription
  }

  encodedFilename () {
    return encodeURIComponent(this.filename.replace(/\./g, ''))
  }

  // transcript set for a file is identified by file last modified; each transcript request is identified by it's this.createdAt
  fileIdentifier () {
    // get rid of stuff react router doesn't like, ie., especially periods
    return `${this.encodedFilename()}-lastModified${this.transcriptMetadata.last_updated_at}`
  }

  showViewUrl () {
    // get rid of stuff react router doesn't like, ie., especially periods
    return `/transcripts/${this.fileIdentifier()}`
  }

  displayCreatedAt () {
    return moment(this.createdAt, "YYYYMMDDTHHmmss[Z]").tz(moment.tz.guess()).format('MMMM Do YYYY, h:mm:ss a') // moment(this.createdAt, "YYYYMMDDTHHMMss").tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))
  }
  
  displayFileLastModified () {
    return moment(parseInt(this.fileLastModified)).tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))
  }

  displayFileSize () {
    return `${(this.fileSize / 1048576).toFixed(2)} MB`
  }

}

export default Transcript
