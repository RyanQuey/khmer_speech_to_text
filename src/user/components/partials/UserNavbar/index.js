import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Button, Navbar, NavbarBrand, Flexbox } from 'shared/components/elements'
import { AccountMenu } from 'shared/components/partials'
import { viewSettingActions } from 'shared/actions'
import { StyleSheet, css } from 'aphrodite'
import theme from 'theme'
import classes from './style.scss'

const styles = StyleSheet.create({
  menu: {
    color: theme.color.white,
  },
})

class UserNavbar extends Component {
  constructor(props) {
    super(props)

    this.state = { }
    this.openLoginModal = this.openLoginModal.bind(this)
    this.nothing = this.nothing.bind(this)
  }

  openLoginModal(e) {
    e.preventDefault()
    viewSettingActions.openModal("UserLogin")
  }

  nothing(e) {
    e.preventDefault()
  }

  render() {
    const { user } = this.props

    return (
      <Navbar>
        <Flexbox justify="space-between">
          <NavbarBrand/>
        </Flexbox>

        <div className={classes.mainNav}>
          <Flexbox className={classes.leftNav} align="center" justify="space-between">
            <Link to="/transcripts">
              Transcripts
            </Link>
          </Flexbox>

          <Flexbox className={classes.rightNav} align="center" justify="space-between">
          
            {user ? (
              <div>
                {user.email}
                <AccountMenu />
              </div>
            ) : (
              <a href="#" onClick={this.openLoginModal}>Login</a>
            )}
          </Flexbox>
        </div>

        <div className={classes.mobileNav}>
          <Flexbox className={classes.rightNav} align="center" justify="space-between">
          
            {user ? (
              <div className={classes.userButtonsWrapper}>
                <AccountMenu />
                <Icon name="bars" onClick={this.props.toggleSidebar.bind(this, undefined)} className={classes.hamburger} size="2x"/> 
              </div>
            ) : (
              <a href="#" onClick={this.openLoginModal}>Login</a>
            )}
          </Flexbox>
        </div>
      </Navbar>
    )
  }
}

UserNavbar.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { user: state.user || null }
}

export default connect(mapStateToProps)(UserNavbar)

