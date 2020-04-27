import { Component } from 'react';
import { connect } from 'react-redux'
import { Flexbox, Button, Input, Checkbox, Icon, Spinner } from 'shared/components/elements'
import {
} from 'constants/actionTypes'
import {formActions} from 'shared/actions'
import classes from './style.scss'
import {
  withRouter,
} from "react-router-dom";
import { TranscriptPicker } from 'user/components/partials'
import Transcript from 'models/Transcript'

//shows up as buttons in mobile, or sidebar in browser?
//used in channels and send
class ShowTranscript extends Component {
  constructor(props) {
    super(props)

    this.findTranscript = this.findTranscript.bind(this)
  }

  componentDidMount() {
    const { transcript } = this.findTranscript()
    // (async side effect)
    // after showing once, stop showing the request in the transcribe request show view
    console.log("MOUNTING trying to hide transcript", transcript)
    transcript && transcript.hideTranscribeRequest()
  }

  componentDidUpdate() {
    const { transcript } = this.findTranscript()
    // (async side effect)
    // after showing once, stop showing the request in the transcribe request show view
    console.log("UPDATING trying to hide transcript", transcript)
    transcript && transcript.hideTranscribeRequest()
  }

  findTranscript () {
    const { transcripts, match } = this.props
    const { params } = match
    const { transcriptIdentifier } = params

    const {encodedFileName, lastModified} = Helpers.getTranscriptDataFromParam(transcriptIdentifier)
    console.log("filename", encodedFileName, lastModified)

    const matchingTranscripts = Helpers.matchingTranscripts(transcripts, encodedFileName, lastModified)

    const transcript = matchingTranscripts.pop()
    return {matchingTranscripts, transcript}
  }

  render() {
    const { transcript, matchingTranscripts} = this.findTranscript()
    console.log("showing transcript: ", transcript, "but all matches include:", matchingTranscripts)
    if (!transcript) {
      return <Spinner />
    }

    console.log("transcript", transcript)

    return (
      <Flexbox direction="column" >
        <h2>{transcript.filename}</h2>
        <div className={classes.transcriptFields}>
          <div>
            <Flexbox direction="column" justify="center" className={classes.textEditor}>
              <div>
                {false && transcript.humanReadableTranscription()}
                {transcript.utterances.map((utterance, i) => 
                  <div key={i} title={utterance.alternatives.length > 1 ? `Alternatively, perhaps should be: ${utterance.alternatives.slice(1).map(a => a.transcript).join(" OR POSSIBLY ")}` : "No alternatives provided"}>
                    {utterance.alternatives[0].transcript}
                    <hr />
                  </div>
                )}
              </div>
              <hr />
              <Flexbox>
                <h3>File Data:</h3>
                
                <div>
                  Created At: {transcript.displayCreatedAt()}
                </div>
                <div>
                  Last Modified: {transcript.displayFileLastModified()}
                </div>
                <div>
                  {transcript.displayFileSize()}
                </div>
              </Flexbox>
            </Flexbox>

          </div>
        </div>

        {matchingTranscripts.length > 1 && 
          <Flexbox>
            <h2>Older transcripts for same file:</h2>
            <TranscriptPicker 
              transcripts={matchingTranscripts.filter(t => (t !== transcript))}
              pickable={false}
            />
          </Flexbox>
        }
      </Flexbox>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    transcripts: state.transcripts,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const ConnectedShowTranscript = withRouter(connect(mapStateToProps, mapDispatchToProps)(ShowTranscript))
export default ConnectedShowTranscript

