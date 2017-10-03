import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Home, Profile, SignUp } from 'user/components/templates'
import { Flexbox, Alert, Navbar } from 'shared/components/elements'
import classes from './Unauthenticated.scss'
import { Sidebar} from 'shared/components/groups'
import { UserNavbar } from 'user/components/partials'
import {
  BrowserRouter,
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
          {false && <Sidebar />}
  
          <Flexbox className={classes.rightColumn} direction="column">
            {alerts && alerts.map((alert) => {
              return <Alert alert={alert} />
            })}
  
            <main>
              <Flexbox className={classes.content} justify="center" flexWrap="wrap">
                <BrowserRouter>
                  <div>
                    <Switch>
                      <Route exact path="/" component={Home} />
                      <Route path="/profile" component={Profile} />
                      <Route path="/signup" component={SignUp} />
                    </Switch>
                  </div>
                </BrowserRouter>
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
