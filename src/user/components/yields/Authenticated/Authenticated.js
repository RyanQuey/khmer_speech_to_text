import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Home, Profile, SignUp } from 'user/components/templates'
import { Flexbox, Alert } from 'shared/components/elements'
import { Navbar } from 'shared/components/groups'
import { UserNavbar, UserSidebar } from 'user/components/partials'
import classes from './Authenticated.scss'
import { BrowserRouter } from 'react-router-dom'

class Authenticated extends Component {
  render() {
    const { children } = this.props
    return (
      <BrowserRouter>
        <Flexbox direction="column">
          <UserNavbar />
    
          <Flexbox>
            <UserSidebar />
    
            <UserContent />
          </Flexbox>
        </Flexbox>
      </BrowserRouter>
    )
  }
}

Authenticated.propTypes = {
  children: PropTypes.node.isRequired,
}
const mapStateToProps = (state) => {
  return { 
    alerts: state.shared.alerts,
  }
}

export default connect(mapStateToProps)(Authenticated)
