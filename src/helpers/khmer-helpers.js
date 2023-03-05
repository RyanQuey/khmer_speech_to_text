import PREFERRED_SPELLINGS from 'helpers/preferred-spellings.json'
import * as bookNames from 'helpers/book-names'

console.log(bookNames)

// make sure numbers correspond to index in array
window.KHMER_NUMBERS = [
  // numbers
  "សូន្យ",
  "មួយ",
  "ពីរ",
  "បី",
  "បួន",
  "ប្រាំ",
  "ប្រាំមួយ",
  "ប្រាំពីរ",
  "ប្រាំបី",
  "ប្រាំបួន",
]
window.KHMER_NUMERALS = [
  // numbers
  "០",
  "១",
  "២",
  "៣",
  "៤",
  "៥",
  "៦",
  "៧",
  "៨",
  "៩",
]

// TODO when slow down active development on puctuation, turn these into const and get off the
// window

// none of these will require "sanna" (kh for "sign") before recognizing it
window.KHMER_PUNCTUATION_NO_LEADER = {
  "ល៉ៈ ": "។ល។",
}
// for performance want to only run once, not for every word in every transcript!
window.KHMER_PUNCTUATION_NO_LEADER_KEYS = Object.keys(KHMER_PUNCTUATION_NO_LEADER)

// all of these will require "sanna" (kh for "sign") before recognizing it
window.KHMER_PUNCTUATION = {
  "ខណ្ឌ":  "។",
  "ខ័ណ្ឌ": "។",
  // need this one too since sometimes they actually return this correctly, but we're having users
  // say khPunctuationLeader bfeore it anyways...
  "។": "។",
  "សួរ":  "?",
  "ឧទាន": "!",
}
// These are different. Keys will be what we want, values a list of the words. 
// Makes it easy to iterate over and check for matches
// TODO for performance, don't iterate over same word "bauk" or "bit" every time!
window.MULTI_WORD_KHMER_PUNCTUATION = {
   // TODO test. Maybe google separates words differently for example
  "\(": [["បើក", "វង់", "ក្រចក"]],
  // TODO test. Maybe google separates words differently for example
  "\)": [["បិត", "វង់", "ក្រចក"]],
  "៖": [["ចំណុច", "ពីរ", "គូស"]],
  "«": [
    ["បើក", "សញ្ញា", "អញ្ញ", "ប្រកាស"],
    // Google has read it this way before, so being flexible
    ["បើក", "សញ្ញា", "អាច", "ប្រកាស"],
    ["សញ្ញា", "បើក", "អាច", "ប្រកាស"],
    ["សញ្ញា", "បើក", "ៗ", "ប្រកាស"],
    ["បើក", "សញ្ញា", "អញ្ញ"],
    // Google has read it this way before, so being flexible
    ["បើក", "សញ្ញា", "ៗ"],
    ["សញ្ញា", "អញ្ញ", "បើក"],
    // Google has read it this way before, so being flexible
    ["សញ្ញា", "ៗ", "បើក" ],
  ],
  "»": [
    // Google has read it this way before, so being flexible
    ["បិទ", "សញ្ញា", "អអាច", "ប្រកាស"],
    ["បិទ", "សញ្ញា", "អញ្ញ", "ប្រកាស"],
    ["សញ្ញា", "បិទ", "អញ្ញ", "ប្រកាស"],
    ["សញ្ញា", "បិទ", "ៗ", "ប្រកាស"],
    ["បិទ", "សញ្ញា", "អញ្ញ"],
    // Google has read it this way before, so being flexible
    ["បិទ", "សញ្ញា", "ៗ"],
    ["សញ្ញា", "អញ្ញ", "បិទ"],
    // Google has read it this way before, so being flexible
    ["សញ្ញា", "ៗ", "បិទ"],
  ],
}
// extra tags to add for punctuations
window.PUNCTUATION_EXTRA_TAGS = {
  "\(": ["preceded-by-nbsp", "parentheses", "opening-punctuation"],
  // TODO test. Maybe google separates words differently for example
  "\)": ["followed-by-nbsp", "parentheses", "closing-punctuation"],
  "៖": ["followed-by-nbsp"],
  "«": ["preceded-by-nbsp", "quotation-marks", "opening-punctuation"],
  "»": ["followed-by-nbsp", "quotation-marks", "closing-punctuation"],
  "។": ["followed-by-nbsp", "end-of-sentence"],
  "?": ["followed-by-nbsp", "end-of-sentence"],
  "!": ["followed-by-nbsp", "end-of-sentence"],
}
window.KHMER_PUNCTUATION_KEYS = Object.keys(KHMER_PUNCTUATION)
window.ALL_KHMER_PUNCTUATION = Object.assign(KHMER_PUNCTUATION, KHMER_PUNCTUATION_NO_LEADER)

const khPunctuationLeader = "សញ្ញា"
// hits anything with the khmer word for "number" before and then an Arabic numeral
const khNumber = "លេខ"
// keep khmer writing on separate line if possible, or else vim gets messed up

// if Google slams this together. Means "one duck" or "two ducks" but if in right context, we can
// assume a Bible verse
const bonusOrdinals = [
  "ទាមួយ",
  "ទាពីរ",
]
const khOrdinalIndicatorArr = [
  "ទី",
  // because sometimes Google sees this here instead 
  "ទា",
  "ទៀត", 
].concat(bonusOrdinals)

// currently used in displaying the words on screen in Show Transcript view, as well as generating
// the captions
// each word is obj with keys [confidence (decimal percentage), endTime (float of seconds), startTime (float of
// seconds), word (str)]
// TODO make a model for a word (?) or maybe utterance
function combineKeywords (words) {
  const ret = []
  for (let i = 0; i < words.length; i++) {
    let wordData = words[i]
    let secondWordData = words[i+1] || {}
    // set some defaults. Will change many of them
    let word = wordData.word, originalWordData = wordData, confidence = wordData.confidence, endTime = wordData.endTime, startTime = wordData.startTime, tags = [], isDefault = true

    if (Helpers.ALL_BOOKS_NO_NUM.includes(wordData.word)) {
      let thirdWordData = words[i+2] || {}
      let fourthWordData = words[i+3] || {}
      console.log("got a book!", [wordData.word, secondWordData.word, thirdWordData.word, fourthWordData.word])
      // is book of Bible, so watch out for funky handling by Google
      // But not necessarily non-default

      if (
        Helpers.BOOKS_WITH_MANY_NO_NUM.includes(wordData.word) &&
        Helpers.khPart == secondWordData.word &&
        Helpers.isOrdinal(thirdWordData.word, fourthWordData.word)
      ) {
        isDefault = false
        // if 3rd is an ordinal by itself, it means Google sent the ordinal bunched together as
        // one "word", so the fourth is not included
        let allInOne = Helpers.bonusOrdinals.includes(thirdWordData.word)
        if (allInOne) {
          let num = thirdWordData.word.replace(Helpers.khOrdinalIndicatorRegEx, "")
          word = `${Helpers.convertToKhmerNumeral(num)}${wordData.word}`
          confidence = [wordData, secondWordData, thirdWordData].reduce((acc, val) => (acc + val.confidence), 0) / 3
          originalWordData = {wordData, secondWordData, thirdWordData} 
          // leave the 4th one out of it
          i += 2

        } else {
          word = `${Helpers.convertToKhmerNumeral(fourthWordData.word)}${wordData.word}`

          // get the average and use as combined word confidence
          // NOTE maybe we should be even more confident, since it fits this pattern?
          confidence = [wordData, secondWordData, thirdWordData, fourthWordData].reduce((acc, val) => (acc + val.confidence), 0) / 4
          originalWordData = {wordData, secondWordData, thirdWordData, fourthWordData} 
          // skip next three words since we're combining them
          i += 3
        }

        tags.push("combined")
        tags.push("preceded-by-nbsp")
        tags.push("followed-by-nbsp")
        tags.push("book-name")
      }

    } else if (wordData.word.match(Helpers.khChapterRegex)) {
      // test if this is reference
      // NOTE that we want to do this even if no book name is recognized, since often no book is
      // recognized at all even if the end user said one
      let thirdWordData = words[i+2] || {}
      let fourthWordData = words[i+3] || {}

      if (Helpers.isNumber(secondWordData.word) && thirdWordData.word && thirdWordData.word.match(Helpers.khVerse) && Helpers.isNumber(fourthWordData.word)) {
        // found a reference
        isDefault = false
        word = `${Helpers.convertToKhmerNumeral(secondWordData.word)}:${Helpers.convertToKhmerNumeral(fourthWordData.word)}`

        // get the average and use as combined word confidence
        // NOTE maybe we should be even more confident, since it fits this pattern?
        confidence = [wordData, secondWordData, thirdWordData, fourthWordData].reduce((acc, val) => (acc + val.confidence), 0) / 4
        endTime = fourthWordData.endTime
        originalWordData = {wordData, secondWordData, thirdWordData, fourthWordData} 
        tags.push("combined")
        tags.push("preceded-by-nbsp")
        tags.push("followed-by-nbsp")
        tags.push("reference")

        // skip next three words since we're combining them
        i += 3
      }

    } else if (wordData.word == Helpers.khPunctuationLeader && Helpers.KHMER_PUNCTUATION_KEYS.includes(secondWordData.word)) {
      // don't just test all words and their following words, will slow things down
      
      // this is punctuation
      isDefault = false
      word = Helpers.KHMER_PUNCTUATION[secondWordData.word]
      endTime = secondWordData.endTime
      originalWordData = {wordData, secondWordData} 
      confidence = [wordData, secondWordData].reduce((acc, val) => (acc + val.confidence), 0) / 2
      tags.push("combined")
      tags.push("punctuation")

      // skip next word since we're combining them
      i += 1

    } else if (Helpers.KHMER_PUNCTUATION_KEYS.includes(wordData.word)) {
      // this is for when GOogle just returns the punctuation sign on their own. We did not say the khPunctuationLeader, but they returned it. 
      // Mostly only happens with ។, I think
      // this is punctuation

      isDefault = false
      tags.push("punctuation")
      tags.push("google-returned-as-punctuation")

    } else if (Helpers.KHMER_PUNCTUATION_NO_LEADER_KEYS.includes(wordData.word)) {
      // is no leader punctuation. Not combining
      isDefault = false
      // 6/23/21 I don't know if we've tried this one before yet, but I believe the following line of code is wrong, we're not combining, we're not even looking at the second word. 
      //word = Helpers.KHMER_PUNCTUATION_NO_LEADER[secondWordData.word]
      tags.push("punctuation")

    } else if (wordData.word == Helpers.khNumber && secondWordData && Helpers.isNumber(secondWordData.word)) {
      // TODO Handle for edge cases. Most of the time, Google returns even multidigit numbers as a
      // single "word". But this is worth testing more.

      // recognizing this as numeral this whether the 2nd word is spelled out Khmer number or Arabic numeral
      isDefault = false

      // if spelled out already, convert to numeral
      word = Helpers.convertToKhmerNumeral(secondWordData.word)

      endTime = secondWordData.endTime
      confidence = [wordData, secondWordData].reduce((acc, val) => (acc + val.confidence), 0) / 2
      originalWordData = {wordData, secondWordData} 
      tags.push("combined")
      tags.push("preceded-by-nbsp")
      tags.push("followed-by-nbsp")
      tags.push("numeral")
      
      // skip next word since we're combining them
      i += 1

    } else if (Helpers.KHMER_NUMBERS.includes(wordData.word)) {
      // sometimes they spell it for us. In which case, just add the right tag
      isDefault = false
      tags.push("spelled-out-number")

    } else if (wordData.word.match(/\d/)) {
      isDefault = false
      // means the previous word was not the Khmer word for number, since we already ruled this
      // out, so hopefully speaker wants it
      // spelled out

      // sometimes there are non-number parts included on the same word...shame on you Google! 
      // For example, 2020_05_04_19_31_55.flac
      // But need to keep that part separate
      // find only the number, in case they mixed letters in the same word
      let numberMatch = wordData.word.match(/^[^\d]*(\d+)[^\d]*$/)
      // make sure numberMatch is not null
      // TODO test this more to make sure there aren't cases to make sure we cover here
      let number = numberMatch ? numberMatch[1] : wordData.word.match(/\d/)

      if (wordData.word.length > 1) {
        // just use numeral anyways
        word = Helpers.convertToKhmerNumeral(number)
        tags.push("numeral")
        tags.push("preceded-by-nbsp")
        tags.push("followed-by-nbsp")

      } else {
        // spell it out
        word = Helpers.KHMER_NUMBERS[number] 
        tags.push("spelled-out-number")
      }

      // add the rest back in
      let nonNumbers = wordData.word.match(new RegExp(`^(.*)?${number}(.*)?$`))
      if (nonNumbers[1] || nonNumbers[2]) {
        tags.push("letters-and-numbers-in-one")

        if (nonNumbers[1]) {
          word = nonNumbers[1] + word
        }
        if (nonNumbers[2]) {
          word = word + nonNumbers[2]
        }
      }

    } else if (Helpers.multiwordPunctuationMatch(words, i)) {
      // checks if matches punctuations where their commands are more than one word
      // it's a little slower to have to call twice, but only runs twice if there's a match, which
      // shouldn't be that often, and it makes for relatively clean code.
      // Could probably improve this too though
      isDefault = false
      let match = Helpers.multiwordPunctuationMatch(words, i) 
      word = match.punctuation

      tags.push("multiword-punctuation")
      tags.push("punctuation")

      endTime = match.endTime
      confidence = match.averageConfidence
      originalWordData = match.originalWordData

      i += match.multiwordLength

    } else if (Helpers.PREFERRED_SPELLINGS[wordData.word]) {
      // NOTE this should always be second to last check. Otherwise we want to change the word to a punctuation/number
      isDefault = false
      let preferredSpelling = Helpers.PREFERRED_SPELLINGS[wordData.word]
      console.log("found alt spelling", wordData, preferredSpelling) 
      word = preferredSpelling
      tags.push("corrected-spelling")

    } else if (Helpers.isEnglish(wordData)) {
      // NOTE this should always be last check. Otherwise we want to change the word to a punctuation/number
      // English words should have spaces. 
      // Other than that can be default
      tags.push("English")
      tags.push("preceded-by-nbsp")
      tags.push("followed-by-nbsp")
    }

    if (isDefault) {
      // word is ready to be used as is
      tags.push("default")
    }

    if (tags.includes("punctuation")) {
      if (PUNCTUATION_EXTRA_TAGS[word]) {
        tags = tags.concat(PUNCTUATION_EXTRA_TAGS[word]) 
      }
    }


    let processedWordData = {
      originalWordData,
      word, 
      confidence, 
      endTime, 
      startTime, 
      tags, 
      // keep prev and next word unprocessed...or else we get into trouble with combined phrases
      //prevWordData: i > 0 ? words[i-1] : null,
      //nextWordData,
    }
    ret.push(processedWordData)
  }

  return ret
}


export default {
  // for different parts of a book, e.g., 1 Kings
  khPart: "ខ្សែ", 
  khOrdinalIndicatorArr, 
  khOrdinalIndicatorRegEx: new RegExp(`${khOrdinalIndicatorArr.join("|")}`), 
  khOrdinalRegEx: new RegExp(`(${khOrdinalIndicatorArr.join("|")})(\d|${KHMER_NUMBERS.join("|")})`), 
  khNumber, 
  khChapter: "ជំពូក",

  // including some misspellings
  khChapterRegex: new RegExp("ជំពូក|ចំពោះ|ជំពោះ"),
  khVerse: "ខ",

  // including some misspellings
  khVerseRegex: new RegExp("ខ|ខល"),
  referencesRegex: /\s?ជំពូក\s?(\d+)\s?ខ\s?(\d+)/gi,

// if colon before or after, counting it as reference, so handling differently
  khmerNumberRegex: new RegExp(`(${khNumber})?\\s?(\\d)`, "gi"),
  // global regexs don't capture
  nonGlobalRegex: (reg) => new RegExp(reg.source, "i"),

  // TODO I'm sure there's a more performant way to do this, but unless it's a math transcript we
  // shouldn't call this too often anyways
  isNumber: (str) => str && (str.match(/\d/) || KHMER_NUMBERS.includes(str)),

  convertToKhmerNumeral: (numStr) => {
    const spelledOutIndex = KHMER_NUMBERS.indexOf(numStr)
    let ret
    if (spelledOutIndex != -1) {
      ret = Helpers.KHMER_NUMERALS[spelledOutIndex]
    } else {
      ret = ""
      // make sure if multidigit string, converts all
      for (let i = 0; i < numStr.length; i++) {
        ret += KHMER_NUMERALS[numStr[i]]
      }
    }

    return ret
  },
  punctuationRegex: new RegExp(Object.keys(ALL_KHMER_PUNCTUATION).join("|"),"gi"),

  // NOTE don't use when looking at individual words
  preferredSpellingRegex: new RegExp(Object.keys(PREFERRED_SPELLINGS).join("|"),"gi"),

  khPunctuationLeader,
  isEnglish: (wordData) => wordData.word.match(/^[a-zA-Z]+$/),

  KHMER_PUNCTUATION, 
  KHMER_PUNCTUATION_NO_LEADER, 
  KHMER_PUNCTUATION_KEYS, 
  KHMER_PUNCTUATION_NO_LEADER_KEYS, 
  KHMER_NUMERALS,
  KHMER_NUMBERS,
  PREFERRED_SPELLINGS, 
  ZERO_WIDTH_SPACE: "/u200B",
  ALL_BOOKS_NO_NUM: bookNames.ALL_BOOKS_NO_NUM, 
  BOOKS_WITH_MANY_NO_NUM: bookNames.BOOKS_WITH_MANY_NO_NUM, 
  bonusOrdinals,
  // check if set of two words returns an ordinal
  isOrdinal: (word1, word2) => (
    (
      Helpers.khOrdinalIndicatorArr.includes(word1) &&
      (KHMER_NUMBERS.includes(word2) || Helpers.isNumber(word2))
    ) || 
    // hacky, but necessary to get edge cases
    bonusOrdinals.includes(word1)
  ),

  combineKeywords,

  /*
   * - takes a single word, which is from the utterance.alternatives[0].words array, and is tagged
   * - since punctuation is dependent upon whether or not there is a following word and what it's
   *   like, we need that info too
   * @return boolean, whether or not there should be a real space (ie NOT zero-width space) 
   */ 
  wordIsFollowedBySpace(wordData, nextWordData) {
    const isFollowedBySpace = nextWordData && (!nextWordData.tags.includes("end-of-sentence") && !nextWordData.tags.includes("closing-punctuation") && (wordData.tags.includes("followed-by-nbsp")) || nextWordData.tags.includes("preceded-by-nbsp"))

    return isFollowedBySpace
  },

  /* 
   * find sentences that are for punctuation, but are multiple words, e.g., for parenthesse and quotes. 
   */
  multiwordPunctuationMatch: (allWords, currentIndex) => {
    let keys = Object.keys(MULTI_WORD_KHMER_PUNCTUATION);
    // iterate over each punctuation to see if there's a match
    let ret = false
    // using some so stops when return true
    keys.some(key => {
      // each punctuation might have multiple possible matches. Iterate over each one
      let possibilitySet = MULTI_WORD_KHMER_PUNCTUATION[key] 
      // using some so stops when return true
      // returning this, so stops enclosing some call also if this returns true
      return possibilitySet.some(valArr => {
        // iterate over each word in the multi-word command to see if all match 
        // allWords[currentIndex] is the current word. i starts at 0, and sees if each word matches in
        // succession
        let match = valArr.every((wordToMatch, i) => {
          return allWords[currentIndex + i] && wordToMatch == allWords[currentIndex + i].word
        });
        if (match) {
          let wordData = allWords[currentIndex]
          let matchedWordsData = _.range(valArr.length).map(i => allWords[currentIndex + i])

          ret = {
            punctuation: key, // in this case, we're using the punctuation mark we want to return as key
            multiwordLength: matchedWordsData.length,
            originalWordData: {wordData},
            averageConfidence: matchedWordsData.reduce((acc, val) => (acc + val.confidence), 0) / matchedWordsData.length,
            endTime: _.last(matchedWordsData).endTime
          }

          // TODO for these use cases, rename key from secondWordData to "wordData2" so can easily
          // set using originalWordData[`wordData${i}`]
          if (valArr.length > 1) {
            ret.originalWordData.secondWordData = matchedWordsData[1]
          }
          if (valArr.length > 2) {
            ret.originalWordData.thirdWordData = matchedWordsData[2]
          }
          if (valArr.length > 3) {
            ret.originalWordData.fourthWordData = matchedWordsData[3]
          }
          // shouldn't be more than 4, but to be safe
          if (valArr.length > 4) {
            ret.originalWordData.fourthWordData = matchedWordsData[4]
          }

          return true
        }
      })
    })

    return ret
  }
}
