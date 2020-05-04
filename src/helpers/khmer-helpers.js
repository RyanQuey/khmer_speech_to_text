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
window.KHMER_PUNCTUATION = {
  "សញ្ញាខណ្ឌ":  "។",
  "សញ្ញាសួរ":  "?",
  "សញ្ញាឧទាន": "!",
  "សញ្ញាបើកវង់ក្រចក": " \(",
  "សញ្ញាបិតវង់ក្រចក":  "\) ",
  "ចំណុចពីរគូស": "៖",
  "ល៉ៈ ": "។ល។",
  "សញ្ញាខ័ណ្ឌ": "។",
}

// hits anything with the khmer word for "number" before and then an Arabic numeral
const khNumber = "លេខ"
// keep khmer writing on separate line if possible, or else vim gets messed up

export default {
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
  punctuationRegex: new RegExp(Object.keys(KHMER_PUNCTUATION).join("|"),"gi"),
  preferredSpellingRegex: new RegExp(Object.keys(PREFERRED_SPELLINGS).join("|"),"gi"),

  KHMER_PUNCTUATION, 
  KHMER_NUMERALS,
  KHMER_NUMBERS,
  PREFERRED_SPELLINGS, 
}
