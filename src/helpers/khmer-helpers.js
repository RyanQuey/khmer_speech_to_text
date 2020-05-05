import PREFERRED_SPELLINGS from 'helpers/preferred-spellings.json'


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

// none of these will require "sanna" (kh for "sign") before recognizing it
window.KHMER_PUNCTUATION_NO_LEADER = {
  "ចំណុចពីរគូស": "៖",
  "ល៉ៈ ": "។ល។",
  "បើកវង់ក្រចក": " \(",
  "បិតវង់ក្រចក":  "\) ",
}
// for performance want to only run once, not for every word in every transcript!
window.KHMER_PUNCTUATION_NO_LEADER_KEYS = Object.keys(KHMER_PUNCTUATION_NO_LEADER)

// all of these will require "sanna" (kh for "sign") before recognizing it
window.KHMER_PUNCTUATION = {
  "ខណ្ឌ":  "។",
  "ខ័ណ្ឌ": "។",
  "សួរ":  "?",
  "ឧទាន": "!",
}
window.KHMER_PUNCTUATION_KEYS = Object.keys(KHMER_PUNCTUATION)
window.ALL_KHMER_PUNCTUATION = Object.assign(KHMER_PUNCTUATION, KHMER_PUNCTUATION_NO_LEADER)

const khPunctuationLeader = "សញ្ញា"
// hits anything with the khmer word for "number" before and then an Arabic numeral
const khNumber = "លេខ"
// keep khmer writing on separate line if possible, or else vim gets messed up

export default {
  khNumber, 
  khChapter: "ជំពូក",
  khVerse: "ខ",
  referencesRegex: /\s?ជំពូក\s?(\d+)\s?ខ\s?(\d+)/gi,
// if colon before or after, counting it as reference, so handling differently
  khmerNumberRegex: new RegExp(`(${khNumber})?\\s?(\\d)`, "gi"),
  // global regexs don't capture
  nonGlobalRegex: (reg) => new RegExp(reg.source, "i"),
  // TODO I'm sure there's a more performant way to do this, but unless it's a math transcript we
  // shouldn't call this too often anyways
  convertToKhmerNumeral: (numStr) => {
    let ret = ""
    // make sure if multidigit string, converts all
    for (let i = 0; i < numStr.length; i++) {
      ret += KHMER_NUMERALS[numStr[i]]
    }

    return ret
  },
  punctuationRegex: new RegExp(Object.keys(ALL_KHMER_PUNCTUATION).join("|"),"gi"),
  // NOTE don't use when looking at individual words
  preferredSpellingRegex: new RegExp(Object.keys(PREFERRED_SPELLINGS).join("|"),"gi"),

  khPunctuationLeader,
  KHMER_PUNCTUATION, 
  KHMER_PUNCTUATION_NO_LEADER, 
  KHMER_PUNCTUATION_KEYS, 
  KHMER_PUNCTUATION_NO_LEADER_KEYS, 
  KHMER_NUMERALS,
  KHMER_NUMBERS,
  PREFERRED_SPELLINGS, 
  ZERO_WIDTH_SPACE: "/u200B",
  isEnglish: (wordData) => wordData.word.match(/^[a-zA-Z]+$/),
}
