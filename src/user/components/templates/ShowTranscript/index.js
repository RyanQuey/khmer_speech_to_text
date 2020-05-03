import { Component } from 'react';
import { connect } from 'react-redux'
import { Flexbox, Button, Input, Checkbox, Icon, Spinner } from 'shared/components/elements'
import {
} from 'constants/actionTypes'
import {alertActions, formActions} from 'shared/actions'
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
    this.hideTranscribeRequests = this.hideTranscribeRequests.bind(this)
  }

  componentDidMount() {
    this.hideTranscribeRequests()
  }

  componentDidUpdate() {
    this.hideTranscribeRequests()
  }

  copy () {
    /* Get the text field */
    const text = document.getElementById("transcript-text").innerText;

    const tempInput = document.createElement("textarea");
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    /* Select the text field */
    tempInput.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    // remove the temp element
    document.body.removeChild(tempInput);

    /* Alert the copied text */
    alertActions.newAlert({
      //title: response.data.transcription,
      title: "Copied text to clipboard",
      level: "SUCCESS",
      options: {timer: true}
    })
  }
  hideTranscribeRequests () {
    const { transcript, matchingTranscripts } = this.findTranscript()
    // (async side effect)
    // after showing once, stop showing the request in the transcribe request show view

    // add transcript back in, since we popped it to get it
    const all = transcript ? matchingTranscripts.concat(transcript) : matchingTranscripts
    all.forEach(t => t.hideTranscribeRequest())
  }

  findTranscript () {
    const { transcripts, match } = this.props
    const { params } = match
    const { transcriptIdentifier } = params

    const {encodedFileName, lastModified} = Helpers.getTranscriptDataFromParam(transcriptIdentifier)

    const matchingTranscripts = Helpers.matchingTranscripts(transcripts, encodedFileName, lastModified)

    const transcript = matchingTranscripts.shift()
    return {matchingTranscripts, transcript}
  }

  render() {
    const { transcript, matchingTranscripts} = this.findTranscript()
    console.log("showing transcript: ", transcript, "but all matches include:", matchingTranscripts)
    if (!transcript) {
      return <Spinner />
    }

    const copyButton = (
      <div>
        <Button onClick={this.copy} small={true}>
          Copy Text
        </Button>
      </div>
    )

    return (
      <Flexbox className={classes.main} direction="column" >
        <h2>{transcript.filename}</h2>
        <div className={classes.transcriptFields}>
          <div>
            <Flexbox justify="flex-start" className={classes.fileData}>
              <Flexbox className={classes.fileDataItems} align="center" justify="flex-start">
                <Flexbox className={classes.fileDataItem}>
                  <div className={classes.label}>Created At:</div> {transcript.displayCreatedAt()}
                </Flexbox>
                <Flexbox className={classes.fileDataItem}>
                  <div className={classes.label}>Size:</div>{transcript.displayFileSize()}
                </Flexbox>
              </Flexbox>
            </Flexbox>
            
            {copyButton}

            <Flexbox id="transcript-text" direction="column" justify="center" className={classes.transcriptText}>
              <Flexbox direction="column">
                {transcript.utterances && transcript.utterances.map((utterance, i) => 
                  <div 
                    key={i} 
                    className={classes.utterance} 
                    title={utterance.alternatives.length > 1 ? `Alternatively, perhaps should be: ${utterance.alternatives.slice(1).map(a => a.transcript).join(" OR POSSIBLY ")}` : "No alternatives provided"}
                  >
                    {utterance.alternatives[0].transcript}
                  </div>
                )}
              </Flexbox>
              <hr />
            </Flexbox>

            {copyButton}
          </div>
        </div>

        {matchingTranscripts.length > 1 && 
          <Flexbox direction="column">
            <h3>Older transcripts for same file:</h3>
            <TranscriptPicker 
              transcripts={matchingTranscripts.filter(t => (t !== transcript))}
              pickable={false}
              summaryOnly={true}
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

