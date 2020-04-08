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
    const {filename, lastModified} = Helpers.getTranscriptDataFromParam(transcriptIdentifier)
    const { transcripts } = this.props
    const matchingTranscripts = Helpers.matchingTranscripts(transcripts, filename, lastModified)
    // TODO will delete old records and select current one by transcactionId
    const currentTranscriptObj = matchingTranscripts.pop()
    console.log("tr", currentTranscriptObj, "mtchs", matchingTranscripts)
    if (!currentTranscriptObj) {
      return <Spinner />
    }
    //const transcript = Transcript.new(currentTranscriptObj)
    const transcript = currentTranscriptObj

    return (
      <Flexbox direction="column" >
        <h2>{transcript.filename}</h2>
        <div className={classes.transcriptFields}>
          <div>
            <Flexbox direction="column" justify="center" className={classes.textEditor}>
              <div>
                {Helpers.humanReadableTranscript(transcript)}
              </div>
              <hr />
              <Flexbox>
                <h3>File Data:</h3>
                
                <div>
                  {transcript.filename}
                </div>
                <div>
                  {moment(transcript.createdAt, "YYYYMMDDHHMMss").format()}
                </div>
                <div>
                  {moment(parseInt(transcript.fileLastModified)).format()}
                </div>
                <div>
                  {(transcript.fileSize / 1048576).toFixed(2)} MB
                </div>
                <div>
                  Base64 Starts with: {transcript.base64Start || ""}
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

