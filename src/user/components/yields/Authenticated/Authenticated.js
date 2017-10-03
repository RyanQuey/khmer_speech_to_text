import { Component } from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Home, Profile, SignUp } from 'user/components/templates'
import { Flexbox, Alert } from 'shared/components/elements'
import { Navbar } from 'shared/components/groups'
import { UserNavbar, UserSidebar } from 'user/components/partials'
import classes from './Authenticated.scss'

class Authenticated extends Component {
  render() {
    const { children } = this.props
    return (
      <Flexbox>
        <UserNavbar />

        <UserSidebar />

        <Flexbox className={classes.rightColumn} direction="column">

          {alerts && alerts.map((alert) => {
            return <Alert alert={alert} />
          })}

          <main>
            <div>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/profile" component={Profile} />
                <Route path="/signup" component={SignUp} />
              </Switch>
            </div>
          </main>
        </Flexbox>
      </Flexbox>
    )
  }
}

Authenticated.propTypes = {
  children: PropTypes.node.isRequired,
  donutchart: PropTypes.node,
}
const mapStateToProps = (state) => {
  return { 
    alerts: state.shared.alerts,
  }
}

export default connect(mapStateToProps)(Authenticated)
