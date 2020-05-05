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
      let secondWordData = words[i+1]
      // set some defaults. Will change many of them
      let word = wordData.word, confidence = wordData.confidence, endTime = wordData.endTime, startTime = wordData.startTime, tags = [], isDefault = true

      if (wordData.word == Helpers.khChapter) {
        // test if this is reference
        let thirdWordData = words[i+2]
        let fourthWordData = words[i+3]

        if (secondWordData.word.match(/\d/) && thirdWordData.word.match(Helpers.khVerse) && fourthWordData.word.match(/\d/)) {
          // found a reference
          isDefault = false
          word = `${secondWordData.word}:${fourthWordData.word}`

          // get the average and use as combined word confidence
          // NOTE maybe we should be even more confident, since it fits this pattern?
          confidence = [wordData, secondWordData, thirdWordData, fourthWordData].reduce((acc, val) => (acc + val.confidence), 0) / 4
          endTime = fourthWordData.endTime
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
        tags.push("combined")
        tags.push("followed-by-nbsp")
        tags.push("punctuation")

        // skip next word since we're combining them
        i += 1

      } else if (Helpers.KHMER_PUNCTUATION_NO_LEADER_KEYS.includes(wordData.word)) {
        // is no leader punctuation. Not combining
        isDefault = false
        word = Helpers.KHMER_PUNCTUATION_NO_LEADER[secondWordData.word]
        tags.push("punctuation")

        if (word == "\(") {
          tags.push("preceded-by-nbsp")

        } else {
          tags.push("followed-by-nbsp")
        }

      } else if (wordData.word == Helpers.khNumber && secondWordData && (
        secondWordData.word.match(/\d/) || Helpers.KHMER_NUMBERS.includes(secondWordData.word)
      )) {
        // want to do this whether the 2nd word is spelled out Khmer number or Arabic numeral
        isDefault = false

        // if spelled out already, convert to numeral
        const spelledOutIndex = Helpers.KHMER_NUMBERS.indexOf(secondWordData.word)
        if (spelledOutIndex != -1) {
          word = Helpers.KHMER_NUMERALS[spelledOutIndex]
        } else {
          word = Helpers.convertToKhmerNumeral(secondWordData.word)
        }

        endTime = secondWordData.endTime
        confidence = [wordData, secondWordData].reduce((acc, val) => (acc + val.confidence), 0) / 4
        tags.push("combined")
        tags.push("preceded-by-nbsp")
        tags.push("followed-by-nbsp")
        tags.push("numeral")
        
        // skip next word since we're combining them
        i += 1

      } else if (wordData.word.match(/\d/)) {
        isDefault = false
        // means the previous word was not the Khmer word for number, so hopefully speaker wants it
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


      } else if (Helpers.PREFERRED_SPELLINGS[wordData.word]) {
        isDefault = false
        let preferredSpelling = Helpers.PREFERRED_SPELLINGS[wordData.word]
        console.log("found alt spelling", wordData, preferredSpelling) 
        word = preferredSpelling
        tags.push("corrected-spelling")

      } else if (Helpers.isEnglish(wordData)) {
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


      let processedWordData = {
        originalWordData: wordData,
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
