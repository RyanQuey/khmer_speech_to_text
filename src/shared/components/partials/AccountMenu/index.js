import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, Button } from 'shared/components/elements'
import { MenuItem, Popup } from 'shared/components/groups'
import { SIGN_OUT_REQUEST } from 'constants/actionTypes'
import theme from 'theme'
import avatar from 'images/avatar.png'
import classes from './style.scss'
import { userActions } from 'shared/actions'
import { withTranslation } from 'react-i18next';

class AccountMenu extends Component {
  constructor(props) {
    super(props)

    this.state = { open: false }

    this.toggleMenu = this.toggleMenu.bind(this)
  }
  toggleMenu(newState = !this.state.open) {
    this.setState({ open: newState })
  }
  render() {
    const { user, signOut, t } = this.props

    return (
      <div className={classes.menuCtn}>
        <Avatar
          onClick={this.toggleMenu}
          margin="0 20px"
          padding="5px"
          size="50px"
          src={user && user.photoURL || avatar}
        />

        <Popup body="left" style="dark" show={this.state.open} handleClickOutside={this.toggleMenu.bind(this, false)}>
          <ul className={`${classes.menuDropdown}`}>
            <MenuItem link="/settings" text={t("Settings")} hoverType="textOnly" />
            <MenuItem link="/" onClick={signOut} text={t("Sign Out")} hoverType="textOnly"/>
          </ul>
        </Popup>
      </div>
    )
  }
}

AccountMenu.propTypes = {
  user: PropTypes.object,
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => {dispatch({type: SIGN_OUT_REQUEST})}
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountMenu))

