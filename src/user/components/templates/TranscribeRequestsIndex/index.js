import { Component } from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'shared/components/elements'
import { SignIn } from 'shared/components/partials'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TranscribeRequestPicker } from 'user/components/partials'
import Transcript from 'models/Transcript'
import TranscribeRequest from 'models/TranscribeRequest'

// AKA untranscribed uploads
class TranscribeRequestsIndex extends Component {
  render() {
    const { user, transcribeRequests } = this.props
    return (
      <div id="unfinished-transcript-ctn">
        <div className="menu-ctn">
          <h1>Unfinished Transcripts</h1>
        </div>
        <TranscribeRequestPicker 
          transcribeRequests={transcribeRequests}
          pickable={true}
        />
      </div>
    )
  }
}

TranscribeRequestsIndex.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { 
    user: state.user,
    transcribeRequests: _.values(state.transcribeRequests)
      .map(transcribeRequestRecord => new TranscribeRequest({transcribeRequestRecord})),
  }
}

export default withRouter(connect(mapStateToProps)(TranscribeRequestsIndex))
