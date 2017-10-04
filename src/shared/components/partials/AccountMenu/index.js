import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, Button, MenuItem } from 'shared/components/elements'
import { SIGN_OUT } from 'constants/actionTypes'
import { StyleSheet, css } from 'aphrodite'
import theme from 'theme'
import avatar from 'images/avatar.png'
import classes from './style.scss'
import { userActions } from 'shared/actions'

const styles = StyleSheet.create({
  menu: {
    color: theme.color.white,
  },
})

class UserHeader extends Component {
  constructor(props) {
    super(props)

    this.state = { open: false }

    this.toggleMenu = this.toggleMenu.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  handleClickOutside(e) {
    if (this.refs.wrapperRef && !this.refs.wrapperRef.contains(e.target)) {
      this.setState({ open: false })
    }  
  }
  toggleMenu(newState) {
    this.setState({ open: !this.state.open })
  }
  render() {
    const { user } = this.props

    return (
      <div className={classes.menuCtn} ref="wrapperRef">
        <Avatar
          onClick={this.toggleMenu}
          margin="0 20px"
          padding="5px"
          size="50px"
          src={user && user.photoURL || avatar}
        />

        {this.state.open ? (
          <ul className={`${classes.menuDropdown} ${css(styles.menu)}`}>
            <MenuItem link="/profile">Profile</MenuItem>
            <MenuItem link="/">
              <div onClick={() => userActions.signOut()}>Sign Out</div>
            </MenuItem>
          </ul>
        ) : (
          <ul></ul>
        )}
      </div>
    )
  }
}

UserHeader.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { user: state.shared.user }
}

export default connect(mapStateToProps)(UserHeader)

