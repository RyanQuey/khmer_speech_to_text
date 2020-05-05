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
      let word, confidence, endTime, startTime, tags = []
      let secondWordData = words[i+1]

      let isDefault = true

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
          startTime = wordData.startTime
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
        startTime = wordData.startTime
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
        startTime = wordData.startTime
        endTime = wordData.endTime
        tags.push("punctuation")

        if (word == "\(") {
          tags.push("preceded-by-nbsp")

        } else {
          tags.push("followed-by-nbsp")
        }

      } else if (wordData.word == Helpers.khNumber && secondWordData.word.match(/\d/)) {
        // means if the following word is a number, they want the Khmer numeral. If not don't change
        isDefault = false
        word = Helpers.convertToKhmerNumeral(secondWordData.word)
        startTime = wordData.startTime
        endTime = secondWordData.endTime
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
        word = Helpers.KHMER_NUMBERS[wordData.word] 
        startTime = wordData.startTime
        endTime = wordData.endTime
        confidence = wordData.confidence
        tags.push("spelled-out-number")

      } else if (Helpers.PREFERRED_SPELLINGS[wordData.word]) {
        isDefault = false
        let preferredSpelling = Helpers.PREFERRED_SPELLINGS[wordData.word]
        console.log("found alt spelling", wordData, preferredSpelling) 
        word = preferredSpelling
        startTime = wordData.startTime
        endTime = wordData.endTime
        confidence = wordData.confidence
        tags.push("corrected-spelling")

      } else if (Helpers.isEnglish(wordData)) {
        // English words should have spaces. Other than that can be default
        tags.push("English")
        tags.push("preceded-by-nbsp")
        tags.push("followed-by-nbsp")
      }

      if (isDefault) {
        // word is ready to be used as is
        word = wordData.word
        startTime = wordData.startTime
        endTime = wordData.endTime
        confidence = wordData.confidence

        tags.push("default")
      }


      let processedWordData = {
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

    console.log("utterance words", ret)
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
          />
        ))}
      </div>
    )
  }
}


export default Utterance
