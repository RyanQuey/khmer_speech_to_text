import { Component } from 'react';
import { connect } from 'react-redux'
import { PROVIDERS } from 'constants/providers'
import { FAKE } from 'constants/actionTypes'
import {
  withRouter,
  Link
} from 'react-router-dom'
import { Flexbox } from 'shared/components/elements'
import { Word } from 'user/components/groups'
import { RESUME_TRANSCRIBING_REQUEST } from 'constants/actionTypes'
import Transcript from 'models/Transcript'
import classes from './style.scss'

class Utterance extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  // each word is obj with keys [confidence (decimal percentage), endTime (float of seconds), startTime (float of
  // seconds), word (str)]
  // TODO make a model for a word (?) or maybe utterance
  combineKeywords (words) {
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

        if (Helpers.isNumber(secondWordData.word) && thirdWordData.word.match(Helpers.khVerse) && Helpers.isNumber(fourthWordData.word)) {
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

      } else if (Helpers.KHMER_PUNCTUATION_NO_LEADER_KEYS.includes(wordData.word)) {
        // is no leader punctuation. Not combining
        isDefault = false
        word = Helpers.KHMER_PUNCTUATION_NO_LEADER[secondWordData.word]
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
        let number = wordData.word.match(/^[^\d]*(\d+)[^\d]*$/)[1]
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

  render () {
    const { utterance } = this.props

    // I think it should be sorted by confidence already. If not...probably leave it,
    // Google messed up I think. Or sort it in API at most
    const bestAlt = utterance.alternatives[0]
    // need to display by word. Otherwise, spell checker breaks down, since don't want to replace
    // parts of a word with a different word...
    // Also, allows for word-based confidence, more granular commands, timing, etc
    const words = this.combineKeywords(bestAlt.words)

    return (
      <div 
        className={`utterance ${classes.utterance} ${bestAlt.confidence < 0.95 ? classes.lowConfidence : ""}`} 
        title={utterance.alternatives.length > 1 ? `Alternatively, perhaps should be: ${utterance.alternatives.slice(1).map(a => a.transcript).join(" OR POSSIBLY ")}` : "No alternatives provided"}
      >
        {words.map((wordData, index) => (
          <Word 
            wordData={wordData} 
            nextWordData={words[index+1]} 
            key={index}
          />
        ))}
      </div>
    )
  }
}


export default Utterance
