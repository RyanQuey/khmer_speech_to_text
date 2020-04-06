import { Component } from 'react';
import { connect } from 'react-redux'
import { Flexbox, Button, Input, Checkbox, Icon } from 'shared/components/elements'
import {
} from 'constants/actionTypes'
import {formActions} from 'shared/actions'
import classes from './style.scss'
import {
  withRouter,
} from "react-router-dom";

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
    const currentTranscriptObj = matchingTranscripts.pop()
    console.log("tr", currentTranscriptObj, "mtchs", matchingTranscripts, "trs", transcripts)
    if (!currentTranscriptObj) {
      return null
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
              <Flexbox>
                Coming soon: transcript and file metadata
              </Flexbox>
            </Flexbox>

          </div>
        </div>
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

