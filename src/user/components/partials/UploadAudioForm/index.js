import { Component } from 'react'
import PropTypes from 'prop-types'
import { 
  withRouter,
  Route,
  Switch,
} from 'react-router-dom'
import { Flexbox } from 'shared/components/elements'
import { DropAudio } from 'shared/components/groups'
import { Home, Profile, Search } from 'user/components/templates'
import requireAuthenticated from 'utils/requireAuthenticated'
import forbidAuthenticated from 'utils/forbidAuthenticated'
import { connect } from 'react-redux'
import classes from './style.scss'
import { formActions } from 'shared/actions'
import Transcript from 'models/Transcript'
import TranscribeRequest from 'models/TranscribeRequest'

class UploadAudioForm extends Component {
  constructor(props) {
    super(props)

    this.cb = this.cb.bind(this)
    this.onFailure = this.onFailure.bind(this)
  }

  onFailure (err) {
    this.props.history.push("/unfinished-transcripts")
    //this.props.history.push(transcribeRequest.transcriptUrl())
  }


  // will use if fail or succeed. Just go to the unfinished transcripts nad user can track the
  // progress
  cb (transcribeRequest) {
    this.props.history.push("/unfinished-transcripts")
    //this.props.history.push(transcribeRequest.transcriptUrl())
  }

  render() {
    const modalOpen = this.props.currentModal

    return (
      <div>
        <Flexbox className={classes.rightColumn} direction="column">

          <div>WARNING: WAV, MP3s and MP4s might work, but probably not, especially MP4s. Long MP4s might not work because they need to be converted and so timeout</div>
          <div>Currently, MP3s must have sample rate hertz of 16,000, and even then might not work. FLAC files are best. So just do FLAC files for now</div>
          <div>Best audio types: No noise cancellation, highest quality</div>
          <DropAudio
            circle
            defaultImage="/public/images/profile/defaultBanner.jpg"
            label="Drop audio file here"
            height="70vh"
            width="100%"
            cb={this.cb}
            onFailure={this.onFailure}
          />
        </Flexbox>
      </div>
    )
  }
}

UploadAudioForm.propTypes = {
  history: PropTypes.object,
}
const mapStateToProps = (state) => {
  return { 
    currentModal: state.viewSettings.currentModal,
  }
}

export default withRouter(connect(mapStateToProps)(UploadAudioForm))

