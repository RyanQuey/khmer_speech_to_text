import { Component } from 'react'
import PropTypes from 'prop-types'
import { 
  withRouter,
  Route,
  Switch,
} from 'react-router-dom'
import { Alert, Flexbox } from 'shared/components/elements'
import { Home, Profile, Search } from 'user/components/templates'
import requireAuthenticated from 'utils/requireAuthenticated'
import forbidAuthenticated from 'utils/forbidAuthenticated'
import { connect } from 'react-redux'
import classes from './style.scss'

class UserContent extends Component {
  render() {
    const alerts = _.values(this.props.alerts)

    return (
      <main>
        <Flexbox className={classes.rightColumn} direction="column">
          {alerts && alerts.map((alert) => {
            return <Alert alert={alert} />
          })}    

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" component={requireAuthenticated(Profile)} />
            <Route path="/search" component={Search} />
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
    alerts: state.shared.alerts,
  }
}

export default withRouter(connect(mapStateToProps)(UserContent))

