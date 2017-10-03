import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Home, Profile, SignUp } from 'user/components/templates'
import { Flexbox, Alert, Navbar } from 'shared/components/elements'
import classes from './Unauthenticated.scss'
import { UserNavbar, UserSidebar } from 'user/components/partials'
import {
  Route,
  Switch,
} from 'react-router-dom'


class Unauthenticated extends Component {
  
  render() {
    const alerts = _.values(this.props.alerts)
    return (
      <Flexbox direction="column">
        <UserNavbar />
  
        <Flexbox>
          <UserSidebar />
  
          <Flexbox className={classes.rightColumn} direction="column">
            {alerts && alerts.map((alert) => {
              return <Alert alert={alert} />
            })}
  
            <main>
              <Flexbox className={classes.content} justify="center" flexWrap="wrap">
                <div>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/signup" component={SignUp} />
                  </Switch>
                </div>
              </Flexbox>
            </main>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    )
  }
}

Unauthenticated.propTypes = {
}
const mapStateToProps = (state) => {
  return { 
    alerts: state.shared.alerts,
  }
}

export default connect(mapStateToProps)(Unauthenticated)
