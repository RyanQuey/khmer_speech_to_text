import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Navbar, NavbarBrand } from 'shared/components/elements'
import { AccountMenu } from 'shared/components/partials'
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
  }
  render() {
    const { user } = this.props

    return (
      <Navbar>
        <NavbarBrand/>

        <ul className={classes.menu}>
          <li><AccountMenu /></li>
        </ul>
      </Navbar>
    )
  }
}

UserNavbar.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { user: state.shared.user }
}

export default connect(mapStateToProps)(UserNavbar)

