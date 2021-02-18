import { Component } from 'react'
import PropTypes from 'prop-types'
import { 
  withRouter,
  Route,
  Switch,
} from 'react-router-dom'
import { Flexbox, Icon } from 'shared/components/elements'
import { Popup, DropAudio } from 'shared/components/groups'
import { Home, Profile, Search } from 'user/components/templates'
import requireAuthenticated from 'utils/requireAuthenticated'
import forbidAuthenticated from 'utils/forbidAuthenticated'
import { connect } from 'react-redux'
import classes from './style.scss'
import { formActions } from 'shared/actions'
import Transcript from 'models/Transcript'
import TranscribeRequest from 'models/TranscribeRequest'
import { withTranslation } from "react-i18next";

// what our app allows for audio uploads. Note that the real, actually secure validation happens in the backend, but
// putting some validation here as well for better user experience and to keep stuff out of google
// storage that won't work anyways too!
const defaultMaxSizeMB = 50

class UploadAudioForm extends Component {
  constructor(props) {
    super(props)

    this.cb = this.cb.bind(this)
    this.onFailure = this.onFailure.bind(this)
    this.onStartUploading = this.onStartUploading.bind(this)
    this.toggleViewingPopup = this.toggleViewingPopup.bind(this)

    this.state = {
      viewingPopup: false,
    }
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

  onStartUploading (transcribeRequest) {
    console.log("Moving to request view now")
    this.props.history.push("/unfinished-transcripts")
  }

	
	toggleViewingPopup () {
    this.setState({viewingPopup: !this.state.viewingPopup})
  }

  render() {
    const modalOpen = this.props.currentModal
    const { t } = this.props
    // either custom quota set in the db or default
    // customQuotas should be set for all users once it all loads (should be a matter of seconds), but if they click too fast don't
    // want this to error
    const maxSizeMB = Helpers.safeDataPath(this.props.user, "customQuotas.audioFileSizeMB", defaultMaxSizeMB)

    return (
      <div>
        <Flexbox className={classes.wrapper} direction="column">

					<div className={classes.needHelpContainer}>
            <span>{t("Upload your Khmer audio to generate a transcript")}</span>
            <div className={classes.popupWrapper}>
              <Icon name="question-circle" className={classes.helpBtn} onClick={this.toggleViewingPopup.bind(this)}/>
              <Popup
                side="bottom"
                float="center"
                handleClickOutside={this.toggleViewingPopup.bind(this, false)}
                show={this.state.viewingPopup}
                containerClass={classes.popupContainer}
              >
                <div className={classes.helpBox}>
                  <div className={classes.instructions}>
                    <div>{t("Upload an audio file to get started. FLAC files are best. WAV, MP3s and MP4s might work, but there is a good chance they won't, especially MP4s")}</div>
                    <div>
                      <div>{t("Best options to use when recording:")}</div>
                      <div> - {t("No noise cancellation")}</div>
                      <div> - {t("High fidelity")}</div>
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
					</div>

          <div>(Maximum file size: {maxSizeMB} MB)</div>

          <DropAudio
            circle
            defaultImage="/public/images/profile/defaultBanner.jpg"
            label={t("Drop audio or click to upload")}
            height="150px"
            width="250px"
            cb={this.cb}
            onFailure={this.onFailure}
            maxSizeMB={maxSizeMB} 
            onStartUploading={this.onStartUploading}
            className={classes.dropAudio}
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
    user: state.user,
  }
}

export default withRouter(connect(mapStateToProps)(withTranslation()(UploadAudioForm)))

