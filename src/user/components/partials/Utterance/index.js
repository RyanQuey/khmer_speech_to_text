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

class Utterance extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render () {
    const { utterance } = this.props

    // I think it should be sorted by confidence already. If not...probably leave it,
    // Google messed up I think. Or sort it in API at most
    const bestAlt = utterance.alternatives[0]
    const bestText = Transcript.displayUtterance(bestAlt.transcript)

    return (
      <div 
        className={`${classes.utterance} ${bestAlt.confidence < 0.95 ? classes.lowConfidence : ""}`} 
        title={utterance.alternatives.length > 1 ? `Alternatively, perhaps should be: ${utterance.alternatives.slice(1).map(a => a.transcript).join(" OR POSSIBLY ")}` : "No alternatives provided"}
      >
        {bestText}
      </div>
    )
  }
}


export default Utterance
