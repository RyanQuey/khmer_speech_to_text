import { Component } from 'react'
import PropTypes from 'prop-types'
import { 
  withRouter,
  Route,
  Switch,
} from 'react-router-dom'
import { Alert, Flexbox } from 'shared/components/elements'
import { UserSettings } from 'shared/components/templates'
import { Home, Profile, Search, Transcripts, UploadAudio, ShowTranscript, TranscribeRequestsIndex } from 'user/components/templates'
import requireAuthenticated from 'utils/requireAuthenticated'
import forbidAuthenticated from 'utils/forbidAuthenticated'
import { connect } from 'react-redux'
import classes from './style.scss'

class UserContent extends Component {
  render() {
    const alerts = _.values(this.props.alerts)
    const modalOpen = this.props.currentModal

    return (
      <main className={classes.userContent}>
        <Flexbox className={classes.rightColumn} direction="column">
          {alerts && !modalOpen && alerts.map((alert, i) => {
            return <Alert alert={alert} key={i} />
          })}    

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/upload" component={requireAuthenticated(UploadAudio)} />
            {false && <Route path="/profile" component={requireAuthenticated(Profile)} />}
            <Route path="/settings" component={requireAuthenticated(UserSettings)} />
            <Route path="/transcripts/:transcriptIdentifier" component={requireAuthenticated(ShowTranscript)} />
            <Route path="/transcripts" component={requireAuthenticated(Transcripts)} />
            <Route path="/unfinished-transcripts" component={requireAuthenticated(TranscribeRequestsIndex)} />
          </Switch>
        </Flexbox>
      </main>
    )
  }
}

UserContent.propTypes = {
  history: PropTypes.object,
}
const mapStateToProps = (state) => {
  return { 
    alerts: state.alerts,
    currentModal: state.viewSettings.currentModal,
  }
}

export default withRouter(connect(mapStateToProps)(UserContent))
