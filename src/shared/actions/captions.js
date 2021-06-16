
import {
  CLEAR_ERRORS,
  HANDLE_ERRORS,
} from 'constants/actionTypes'
import {
  newAlert
} from 'shared/actions/alerts'
import _ from "lodash"
import KhmerHelpers from 'helpers/khmer-helpers'

// borrowing from https://stackoverflow.com/a/58557717/6952495
// consider using this lib instead https://github.com/LuisMayo/GoogleSTTtoSRTConverter/

/*
 * adds a single entry to the captions (ie a single timestamp, and a single stamp of words
 *
 * - phrase does NOT need to be an utterance, but needs to be in the same format of an alternative
 *   of an utterance (e.g,. utterance.alternatives[0])
 *   should have keys like this: 
 *   {
 *     transcript: "...",
 *     words: [
 *      {confidence: 0.9792556
 *      endTime: "1.800s"
 *      startTime: "0s"
 *      word: "សួស្ដី"},
 *      ...
 *     ]
 *   }
 * @return obj with data to add to srt file
 */ 
function convertGSTPhraseToSRT(phrase) {
  let resultForPhrase = ""
  const firstWord = phrase.words[0]
  const startTime = convertSecondStringToTime(firstWord.startTime);

  const lastWord = phrase.words[phrase.words.length - 1]
  const endTime = convertSecondStringToTime(lastWord.endTime);

  const timeStrForEntry = `${formatTime(startTime)} --> ${formatTime(endTime)}`


  return {
    timeStrForEntry, 
    transcriptText: phrase.transcript,
  };
}

function addPhraseToCaptions (phrase, captionsStr) {

}

// TODO get more precise seconds, this is cutting off the milliseconds
function formatTime(time) {
  return String(time.hours).padStart(2, '0')+ ':' + String(time.minutes).padStart(2, '0') + ':' + 
  String(time.seconds).padStart(2, '0') + ',' + time.milliseconds;
}

// takes second string returned from transcript and converts to time format we want for srt
function convertSecondStringToTime(string) {
  // cut off the final "s" from the google transcript timestamp
  // e.g., "177.100s" > "177.100"
  const secondsMatch = string.match(/^(\d+)\.?(\d+)?s$/) //substring(0, string.length - 1);
  const totalSeconds = secondsMatch[1]

  // get the milliseconds separately
  // e.g., "177.100s" > "100", or "40s" > "000"
  const milliseconds = secondsMatch[2] || "000"

  // get hours
  // e.g., 177.100/3600
  const hours = Math.floor(totalSeconds / 3600);

  // get just the remainder of the hours
  const minutes = Math.floor(totalSeconds % 3600 / 60);

  // get just the remainder of the minutes
  const seconds = Math.floor(totalSeconds % 3600 % 60);

  return {
    hours, minutes, seconds, milliseconds
  }
}


/*
 * - splits by spaces (but not zero width spaces), punctuation
 * - if there is a maximumWordsPerPhrase set, also splits by that number
 */
const splitUtteranceByBreaks = (bestAlt, maximumWordsPerPhrase = false) => {
  const phrases = []
  const emptyPhrase = {transcript: "", words: []}

  let currentPhrase = _.cloneDeep(emptyPhrase)
  phrases.push(currentPhrase)

  const wordCount = bestAlt.words.length

  // iterate over each word
  bestAlt.words.forEach((wordData, i) => {

    let nextWordData = bestAlt.words[i +1]

    // add word to list of words
    currentPhrase.words.push(wordData)

    // add transcript of word to transcript for phrase
    currentPhrase.transcript += wordData.word

    const hasWordAfter = i < wordCount -1 

    const hitMax = maximumWordsPerPhrase && currentPhrase.words.length == maximumWordsPerPhrase

    // if has space after it OR if we are at the maximum words set and there is at least one following word, make start a new phrase
    // NOTE don't want to find zero width spaces, just normal spaces, so NOT using \s to find spaces
      // Make sure this is done at end, since Google is adding spaces at end of words, not beginning
    if (hitMax && nextWordData || KhmerHelpers.wordIsFollowedBySpace(wordData, nextWordData)) { 
      // split off to new phrase
      currentPhrase = _.cloneDeep(emptyPhrase)
      phrases.push(currentPhrase)
    }
  })

  return phrases
}

function convertTranscriptToPhrases (transcript) {
  let phrases = []

  // const splitBy = "utterance"
  const splitBy = "space"
  // only when splitBy is "space"
  const maximumWordsPerPhrase = 10

  // basically a reduce job, convert utterances into one or more phrases
  transcript.utterances.forEach((utterance) => {

    // "phrase" is an array of arbitrary number of words to be displayed in a single caption

    let entryForUtterance
    // combine words, edit spelling, add spaces etc
    // just overwrite the utterance
    
    // make sure to clone, we're doing some mutation here and we don't want to change anything
    // elsewhere in the app
    const bestAlt = _.cloneDeep(utterance.alternatives[0])

    const formattedWords = KhmerHelpers.combineKeywords(bestAlt.words)
    bestAlt.words = formattedWords
    bestAlt.transcript = formattedWords.map(w => w.word)

    if (splitBy == "utterance") {
      phrases.push(bestAlt)

    } else if (splitBy == "space") {
      // splits by normal space (ie NOT zero width space)
      const phrasesFromUtterance = splitUtteranceByBreaks(bestAlt, maximumWordsPerPhrase)
      phrases = phrases.concat(phrasesFromUtterance)

    }
  })

  return phrases
}

// converts a transcript instance to srt
export const convertToSRT = (transcript) => {
  if (!transcript.utterances) {
    // probably just throw an error...?
    return
  } 

  const phrases = convertTranscriptToPhrases(transcript)



  const result = phrases.map((phrase, i) => {
    // convert to srt format string
    const { transcriptText, timeStrForEntry } = convertGSTPhraseToSRT(phrase)

    return `${i + 1}
${timeStrForEntry}
${transcriptText}

`
  })

  // what will be exported to file
  return result.join("")
}
