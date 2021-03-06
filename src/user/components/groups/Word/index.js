import { Component } from 'react';
import { connect } from 'react-redux'
import {
  withRouter,
  Link
} from 'react-router-dom'
import { Flexbox } from 'shared/components/elements'
import { RESUME_TRANSCRIBING_REQUEST } from 'constants/actionTypes'
import Transcript from 'models/Transcript'
import classes from './style.scss'
import { withTranslation } from "react-i18next";
import KhmerHelpers from 'helpers/khmer-helpers'

class Word extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render () {
    // NOTE nextWordData hasn't been combined or checked for whether it is punctuation, number, etc. or not
    const { wordData, prevWordData, nextWordData, t  } = this.props
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
        title={confidenceClass == classes.warning ? t("Google returned a single word with letters and numbers: ") + wordData.originalWordData.word : `${t("Confidence Level")}: ${parseFloat(confidence* 100, 2)}%`}
      >
        {word}
        {KhmerHelpers.wordIsFollowedBySpace(wordData, nextWordData) ? '\u00A0' : '\u200B'}
      </span>
    )
  }
}


export default withTranslation()(Word)
