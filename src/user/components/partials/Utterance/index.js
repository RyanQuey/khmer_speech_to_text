import { Component } from 'react';
import { connect } from 'react-redux'
import KhmerHelpers from 'helpers/khmer-helpers'
import {
  withRouter,
  Link
} from 'react-router-dom'
import { Flexbox } from 'shared/components/elements'
import { Word } from 'user/components/groups'
import classes from './style.scss'

class Utterance extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }


  render () {
console.log(KhmerHelpers)
    const { utterance } = this.props

    // I think it should be sorted by confidence already. If not...probably leave it,
    // Google messed up I think. Or sort it in API at most
    const bestAlt = utterance.alternatives[0]
    // need to display by word. Otherwise, spell checker breaks down, since don't want to replace
    // parts of a word with a different word...
    // Also, allows for word-based confidence, more granular commands, timing, etc
    const words = KhmerHelpers.combineKeywords(bestAlt.words)

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
