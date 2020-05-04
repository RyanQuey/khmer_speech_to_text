import { TRANSCRIPTION_STATUSES} from "constants/transcript"
import TranscribeRequest from 'models/TranscribeRequest'

// TODO create model class, with stuff for schema etc
//class Transcript extends Model {
// takes transcript from firestore record (uses underscored keys from the api) 
class Transcript {
  constructor(transcriptData) {
    // super()

    // assign keys and values from transcript to this

    this.fileLastModified = transcriptData.file_last_modified
    this.createdAt = Helpers.safeDataPath(transcriptData, "transcript_metadata.last_updated_at")
    this.filePath = transcriptData.file_path
    this.fileSize = transcriptData.file_size
    this.fileType = transcriptData.content_type
    this.transactionId = transcriptData.transaction_id
    this.userId = transcriptData.user_id
    this.filename = transcriptData.filename
    this.utterances = transcriptData.utterances
    this.uploadedAt = transcriptData.uploaded_at
    // TODO need to persist this on the transcript not as id, but transcribe_request_id...
    this.transcribeRequestId = transcriptData.id
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
    return `${this.encodedFilename()}-lastModified${this.fileLastModified}`
  }

  showViewUrl () {
    // get rid of stuff react router doesn't like, ie., especially periods
    return `/transcripts/${this.fileIdentifier()}`
  }

  displayCreatedAt () {
    return moment.utc(this.createdAt, "YYYYMMDDTHHmmss[Z]").tz(moment.tz.guess()).format('MMMM Do YYYY, h:mm:ss a') // moment(this.createdAt, "YYYYMMDDTHHMMss").tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))
  }
  
  displayFileLastModified () {
    return moment(parseInt(this.fileLastModified)).tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm a'))
  }

  displayFileSize () {
    return `${(this.fileSize / 1048576).toFixed(2)} MB`
  }

  async hideTranscribeRequest () {
    let tr = this.getTranscribeRequest()
    if (tr && !tr.hidden) {
      await tr.markAsHidden()
    } 
  }

  getTranscribeRequest () { 
    const trs = _.values(store.getState().transcribeRequests)
    const match = trs.find(tr => tr.id == this.transcribeRequestId)

    return match && new TranscribeRequest({transcribeRequestRecord: match})
  }

  // maps certain spelled out words to their puncuation equivalent
  static displayUtterance (utteranceTranscript) {
    // TODO probably better to put in unicode bytes here instead for accuracy and ease of reading
    // want it to be like: 1 Clement" 1:19 " so spaces before and after. Will change to Khmer
    // numbers in the punctuation regex

    // TODO make sure references don't get switched over somehow...
    const withFixedReferences = utteranceTranscript.replace(Helpers.referencesRegex, (matched) => {
      const match = matched.match(Helpers.nonGlobalRegex(Helpers.referencesRegex));
      // don't wait to change to Khmer numerals later, since references don't follow the normal
      // rule. Keep it separate, and save a lot of grief in regex wasteland
      return ` ${Helpers.convertToKhmerNumeral(match[1])}:${Helpers.convertToKhmerNumeral(match[2])} `
    })
    // first, converting all numbers with លេខ in front to Khmer numerals
    // I think it's better to only run one replace for both types of numbers rather than two
    // replaces with separate logic, since it has to iterate over whole string. So regex needs to
    // match both types, then decide which one to 
    const withFixedNumberals = withFixedReferences.replace(Helpers.khmerNumberRegex, (matched) => {
      const match = matched.match(Helpers.nonGlobalRegex(Helpers.khmerNumberRegex));

      // e.g., 1 or 5 etc
      const theNumber = match[2]
      // if they use the Khmer word for "number" before, or it's more than 9, use Khmer numeral
      if (match[1] || theNumber.length > 1) {
        return Helpers.convertToKhmerNumeral(theNumber)

      } else {
        // spell it out
        return Helpers.KHMER_NUMBERS[theNumber]
      }
    })

    // set words with alternate spellings
    const withPreferredSpellings = withFixedNumberals.replace(Helpers.preferredSpellingRegex, (match) => {console.log(match, Helpers.PREFERRED_SPELLINGS[match]); return Helpers.PREFERRED_SPELLINGS[match]})
    const processedUtterance = withPreferredSpellings.replace(Helpers.punctuationRegex, (match) => Helpers.KHMER_PUNCTUATION[match]);

    return processedUtterance
  }

}

export default Transcript
