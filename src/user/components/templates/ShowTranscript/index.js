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


    this.state = {
    }
  }

  render() {
    const { params } = this.props.match
    const { transcriptIdentifier } = params
    // TODO move all this into helper and thin into willreceiveProps so it updates on page change and when transcripts get loaded
    const {encodedFileName, lastModified} = Helpers.getTranscriptDataFromParam(transcriptIdentifier)
    console.log("filename", encodedFileName, lastModified)
    const { transcripts } = this.props

    const matchingTranscripts = Helpers.matchingTranscripts(transcripts, encodedFileName, lastModified)

    // TODO will hide old records and select current one by transcactionId, rather than array order which is unreliable
    const transcript = matchingTranscripts.pop()
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
                {transcript.utterances.map(utterance => 
                  <div title={utterance.alternatives.length > 1 ? `Alternatively, perhaps should be: ${utterance.alternatives.slice(1).map(a => a.transcript).join(" OR POSSIBLY ")}` : "No alternatives provided"}>
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
              transcripts={matchingTranscripts.filter(t => (t !== currentTranscriptObj))}
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

