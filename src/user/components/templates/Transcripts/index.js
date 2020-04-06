import { Component } from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'shared/components/elements'
import { SignIn } from 'shared/components/partials'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TranscriptPicker } from 'user/components/partials'

class Transcripts extends Component {
  render() {
    const { user } = this.props
    return (
      <div id="Transcript-ctn">
        <div className="menu-ctn">
          <h1>Transcripts</h1>
        </div>
        <TranscriptPicker 
          transcripts={this.props.transcripts}
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
    transcripts: state.transcripts,
  }
}

export default withRouter(connect(mapStateToProps)(Transcripts))
