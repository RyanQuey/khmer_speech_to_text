import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Home, Profile, SignUp, UserContent } from 'user/components/templates'
import { Flexbox, Alert } from 'shared/components/elements'
import { Navbar } from 'shared/components/groups'
import { UserNavbar, UserSidebar } from 'user/components/partials'
import classes from './Authenticated.scss'
import { withRouter } from 'react-router-dom'


class Authenticated extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showSidebarInMobile: false,  // only applicable for mobile
    }
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }


  toggleSidebar () {
    console.log("now toggling")
    this.setState({showSidebarInMobile: !this.state.showSidebarInMobile})
  }

  render() {
    const { children } = this.props
    const { showSidebarInMobile } = this.state
    const alerts = _.values(this.props.alerts)
    const modalOpen = this.props.currentModal
    
    return (
      <Flexbox direction="column">
        <UserNavbar toggleSidebar={this.toggleSidebar}/>
  
        <Flexbox>
          <UserSidebar show={showSidebarInMobile}/>
  
          <UserContent />
        </Flexbox>
      </Flexbox>
    )
  }
}

Authenticated.propTypes = {
  // other option is to make this a wrapper tag and give it children, but not doing it that way for now  
  // doing children might be better though; means you can easily see and set views to only be for loggedin users from within teh component itself
  //  children: PropTypes.node.isRequired,
}
const mapStateToProps = (state) => {
  return { 
    alerts: state.alerts,
    currentModal: state.viewSettings.currentModal,
  }
}

export default withRouter(connect(mapStateToProps)(Authenticated))
