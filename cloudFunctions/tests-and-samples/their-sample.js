// NOTE non-flac, single channel sends base64 string which is what I'm sending, which doesn't get the good results that the google sample sends
// NOTE flac, two channel sends base64 string which is what I'm not yet sending, which gets the good results
// NOTE non-flac, two channel sends base64 string which is what I'm not yet sending, 
// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const format = "mp3"
let flac, wav, mp3
if (format == "flac") {
  flac = true
} else if (format == "mp3") {
  mp3 = true
} else if (format == "wav") {
  wav = true
}

// the original file
const m4aFile = '/media/sf_shared_with_vm/Sound recordings/With Flexymic and sound adapter (loud background audio).m4a'; // returns the wrong transcript
// can get flac or wav etc by doing: ffmpeg -i ./With\ Flexymic\ and\ sound\ adapter\ \(loud\ background\ audio\).m4a fileout.wav
const wavFile = '/media/sf_shared_with_vm/Sound recordings/fileout.wav'; // returns the right transcript
const flacFile = '/media/sf_shared_with_vm/Sound recordings/fileout.flac';// returns the right transcript
// can get mp3 by doing: ffmpeg -v 5 -y -i input.m4a -acodec libmp3lame -ac 2 -ab 192k output.mp3
const mp3File = '/media/sf_shared_with_vm/Sound recordings/fileout.mp3';// 


// experimenting with m4a to see if something magic can happen. Note that Linear16 is lossless; m4a is lossy
let encoding, sampleRateHertz, filename
if (flac) {
  encoding = "FLAC"
  sampleRateHertz = 48000  
  filename = flacFile
} else if (wav) {
  encoding = 'LINEAR16';
  sampleRateHertz = 48000  
  filename = wavFile
} else if (mp3) {
  encoding = 'MP3';
  sampleRateHertz = 16000  
  filename = mp3File
} else {
  // don't know what's best for m4a yet!
  encoding = 'LINEAR16';
  sampleRateHertz = 16000  
  filename = m4aFile
}

const config = {
  encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: 'km-KH',
  enableAutomaticPunctuation: true,
};

// might be good for m4a too? I assume it would be...
// assuming multiple channels for the audio, though in reality probably depends on what the clip is, or mic or something (?)
if (flac || wav) {
  config.audioChannelCount = 2
  config.enableSeparateRecognitionPerChannelaudioChannelCount = true
}

const base64 = fs.readFileSync(filename).toString('base64')
console.log("start of base64 is: ", base64.slice(0, 15));
console.log("end of base64 is: ", base64.slice(-15, -1));
console.log("config: ", config)
const audio = {
  content: base64,
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
client.recognize(request)
  .then(([response]) => {
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: `, transcription);
})
