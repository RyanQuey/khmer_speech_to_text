import { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './style.scss'
import logo from 'images/logo.png'
import { MenuItem } from 'shared/components/elements'

const NavbarBrand = ({ background }) => {
  return (
    <MenuItem link="/">
      <div className={classes.brand} >
        <img alt="logo" src={logo} />
      </div>
    </MenuItem>
  )
}

NavbarBrand.propTypes = {
}
export default NavbarBrand

