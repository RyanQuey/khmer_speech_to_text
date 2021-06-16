
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
 * @return string to add to srt file
 */ 
function convertGSTPhraseToSRT(phrase) {
  let resultForPhrase = ""
  const firstWord = phrase.words[0]
  const startTime = convertSecondStringToTime(firstWord.startTime);
  resultForPhrase += formatTime(startTime) + ' --> '

  const lastWord = phrase.words[phrase.words.length - 1]
  const endTime = convertSecondStringToTime(lastWord.endTime);

  resultForPhrase += formatTime(endTime) + '\n'
  resultForPhrase += phrase.transcript + '\n\n'

  return resultForPhrase;
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
  var seconds = string.substring(0, string.length - 1);

  // get the milliseconds separately
  // e.g., "177.100" > "100"
  var milliseconds = seconds.match(/\d+$/)

  // get hours
  // e.g., 177.100/3600
  var hours = Math.floor(seconds / 3600);

  // get just the remainder of the hours
  var minutes = Math.floor(seconds % 3600 / 60);

  // get just the remainder of the minutes
  seconds = Math.floor(seconds % 3600 % 60);

  return {
    hours, minutes, seconds, milliseconds
  }
}


/*
 * - splits by spaces (but not zero width spaces), punctuation
 *
 */
const splitUtteranceByBreaks = (bestAlt) => {
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

    // if has space, make start a new phrase
    // NOTE don't want to find zero width spaces, just normal spaces, so NOT using \s to find spaces
      // Make sure this is done at end, since Google is adding spaces at end of words, not beginning
    if (KhmerHelpers.wordIsFollowedBySpace(wordData, nextWordData)) { 
      currentPhrase = _.cloneDeep(emptyPhrase)
      phrases.push(currentPhrase)
    }
  })

  return phrases
}

// converts a transcript instance to srt
export const convertToSRT = (transcript) => {
  if (!transcript.utterances) {
    return
  } 

  // what will be exported to file
  var result = ''
  // const splitBy = "utterance"
  const splitBy = "space"
  let entryIndex = 1

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
      const phrase = bestAlt
      // convert to srt format string
      entryForUtterance = convertGSTPhraseToSRT(phrase)

      // add to result
      result += entryIndex
      result += '\n'
      result += entryForUtterance
      entryIndex ++

    } else if (splitBy == "space") {
      // splits by normal space (ie NOT zero width space)
      const phrases = splitUtteranceByBreaks(bestAlt)
      phrases.forEach((phrase) => {
        // convert to srt format string
        entryForUtterance = convertGSTPhraseToSRT(phrase)

        // add to result
        result += entryIndex
        result += '\n'
        result += entryForUtterance

        entryIndex ++
      })
    }

  })

  return result
}
