import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Home, Profile, SignUp, UserContent } from 'user/components/templates'
import { Flexbox, Alert } from 'shared/components/elements'
import { Navbar } from 'shared/components/groups'
import { UserNavbar, UserSidebar } from 'user/components/partials'
import classes from './Authenticated.scss'
import { withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next';

import info from 'constants/info'
const { supportEmail, instructionVideoEnglishUrl, instructionVideoKhmerUrl } = info


class Authenticated extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showSidebarInMobile: false,  // only applicable for mobile
    }
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }


  toggleSidebar (show, e) {
    if (show === undefined) {
      show = !this.state.showSidebarInMobile
    }

    // hide the scrollbar for when the sidebar is up in mobile, so just see the sidebar
    if (show) {
      document.querySelector("html").style.overflowY = "hidden"
    } else {
      document.querySelector("html").style.overflowY = "auto"
    }

    this.setState({showSidebarInMobile: show})
  }

  render() {
    const { children, user, t, i18n } = this.props
    const { showSidebarInMobile } = this.state
    const alerts = _.values(this.props.alerts)
    const modalOpen = this.props.currentModal
    const isWhitelisted = user.isWhitelisted
    
    return (
      <div>
        {isWhitelisted ? (
          <Flexbox direction="column">
            <UserNavbar toggleSidebar={this.toggleSidebar}/>
      
            <Flexbox>
              <UserSidebar show={showSidebarInMobile} toggleSidebar={this.toggleSidebar}/>
      
              <UserContent />
            </Flexbox>
          </Flexbox>
        ) : (
          <div>
            We're sorry, it looks like this email ({user.email}) has not yet been allowed to user the Khmer Voice App. To get permission, please send us an email at {supportEmail}.
          </div>
        )
        }
      </div>
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
    user: state.user,
  }
}

export default withRouter(connect(mapStateToProps)(withTranslation()(Authenticated)))
