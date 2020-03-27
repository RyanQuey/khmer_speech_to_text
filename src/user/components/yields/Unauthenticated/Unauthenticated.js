import { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Flexbox, Navbar } from 'shared/components/elements'
import { 
  withRouter,
  Route,
  Switch,
} from 'react-router-dom'
import classes from './Unauthenticated.scss'
import { UserNavbar, UserSidebar } from 'user/components/partials'
import { UserLogin, UserContent } from 'user/components/templates'
import {
  BrowserRouter,
} from 'react-router-dom'
import { connect } from 'react-redux'

class Unauthenticated extends Component {
  
  render() {
    const { children } = this.props
    const alerts = _.values(this.props.alerts)
    const modalOpen = this.props.currentModal
     
    return (
      <div>
          <Flexbox direction="column">
            <UserNavbar />
      
            <Flexbox>
              <UserSidebar />
      
              <h1>Login to Upload your audio file</h1>
            </Flexbox>
          </Flexbox>

        <UserLogin />
      </div>
    )
  }
}

Unauthenticated.propTypes = {
}

const mapStateToProps = (state) => {
  return { 
    alerts: state.alerts,
    currentModal: state.viewSettings.currentModal,
  }
}

export default withRouter(connect(mapStateToProps)(Unauthenticated))
