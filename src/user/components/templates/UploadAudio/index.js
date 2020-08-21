import { Component } from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'shared/components/elements'
import { UploadAudioForm } from 'user/components/partials'
import { connect } from 'react-redux'
import { withTranslation } from "react-i18next";

class UploadAudio extends Component {
  render() {
    const { user, t } = this.props
    return (
      <div id="home-ctn">
        <div className="menu-ctn">
        </div>
        <h1>{t("Upload your audio file")}</h1>
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

export default connect(mapStateToProps)(withTranslation()(UploadAudio))
