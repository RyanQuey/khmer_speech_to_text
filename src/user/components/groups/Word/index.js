import { Component } from 'react';
import { connect } from 'react-redux'
import { PROVIDERS } from 'constants/providers'
import { FAKE } from 'constants/actionTypes'
import {
  withRouter,
  Link
} from 'react-router-dom'
import { Flexbox } from 'shared/components/elements'
import { RESUME_TRANSCRIBING_REQUEST } from 'constants/actionTypes'
import Transcript from 'models/Transcript'
import classes from './style.scss'

class Word extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render () {
    const { wordData, prevWordData, nextWordData  } = this.props
    const { word, confidence, startTime, endTime, tags} = wordData

    // I think it should be sorted by confidence already. If not...probably leave it,
    // Google messed up I think. Or sort it in API at most
    let confidenceClass
    if (tags.includes("letters-and-numbers-in-one")) {
      confidenceClass = classes.warning

    } else if (confidence > 0.95) {
      confidenceClass = classes.confident

    } else  if (confidence > 0.85) {
      confidenceClass = classes.lowConfidence

    } else  if (confidence > 0.65) {
      confidenceClass = classes.failing

    } else if (confidence < 0.65)  {
      confidenceClass = classes.abysmal
    }


    return (
      <span 
        className={`word ${classes.word} ${confidenceClass}`} 
        title={confidenceClass == classes.warning ? "Google returned a single word with letters and numbers: " + wordData.originalWordData.word : `Confidence Level: ${parseFloat(confidence* 100, 2)}%`}
      >
        {word}
        {nextWordData && (wordData.tags.includes("followed-by-nbsp") || nextWordData.tags.includes("preceded-by-nbsp") ? '\u00A0' : '\u200B')}
      </span>
    )
  }
}


export default Word
