export const TRANSCRIPTION_STATUSES = [
  // the first stage, before this no reason to bother even recording
  // client sets
  "uploading",

  // finished upload
  // client sets
  "uploaded",

  // when request has been received and accepted by our server, and is processing the file
  // server sets
  "received-by-server", 

  // when Google has started the operation to transcribe the file, and is currently transcribing.   
  // server sets
  "transcribing", 

  // Google finished transcribing, but we haven't yet processed their transcription for whatever reason
  "transcription-complete",

  // we finished processing their transcription, and it is stored in firestore
  "transcription-processed",

  // when request had been received and accepted by our server, but then we errored before beginning the translation through google
  // server sets
  "server-error", 

  // when Google had started the operation to transcribe the file, but then Google had some sort of error
  // client sets or server sets (if server had crashed and didn't get a chance to set it by itself)
  "transcribing-error", 
]

