import { Component } from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'shared/components/elements'
import { SignIn } from 'shared/components/partials'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TranscriptPicker } from 'user/components/partials'
import Transcript from 'models/Transcript'
import { withTranslation } from "react-i18next";

class Transcripts extends Component {
  render() {
    const { user, transcripts, t } = this.props
    const transcriptsToShow = _.uniqBy(transcripts, (t) => t.fileIdentifier())
    return (
      <div id="Transcript-ctn">
        <div className="menu-ctn">
          <h1>{t("Transcripts")}</h1>
        </div>
        <TranscriptPicker 
          transcripts={transcriptsToShow}
          pickable={true}
        />
      </div>
    )
  }
}

Transcripts.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { 
    user: state.user,
    transcripts: _.values(state.transcripts).map(t => new Transcript(t)),
  }
}

export default withRouter(connect(mapStateToProps)(withTranslation()(Transcripts)))
