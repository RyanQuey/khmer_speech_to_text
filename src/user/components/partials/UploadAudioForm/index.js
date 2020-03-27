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

class UploadAudioForm extends Component {
  render() {
    const modalOpen = this.props.currentModal
    // TODO remove, now unnecessary
function doIt (e) {
  e.preventDefault()
  const file = $("#audio-file-form input")[0].files[0]
  console.log("doing it", file)

  formActions.uploadAudioFile(file)
}


    return (
      <div>
        <Flexbox className={classes.rightColumn} direction="column">

          <DropAudio
            circle
            defaultImage="/public/images/profile/defaultBanner.jpg"
            label="Drop audio file here"
            height="70vh"
            width="100%"
          />
          {false && <form id="audio-file-form" action={location.href} method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <button type="submit" onClick={doIt}>Submit</button>
          </form>}


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

