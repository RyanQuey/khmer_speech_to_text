import { Component } from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'shared/components/elements'
import { UploadAudioForm } from 'user/components/partials'
import { connect } from 'react-redux'

class UploadAudio extends Component {
  render() {
    const { user } = this.props
    return (
      <div id="home-ctn">
        <div className="menu-ctn">
        </div>
        <h1>Upload your audio file</h1>
        <UploadAudioForm />
      </div>
    )
  }
}

UploadAudio.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(UploadAudio)
