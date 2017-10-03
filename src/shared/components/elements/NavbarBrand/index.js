import { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './style.scss'
import logo from 'images/logo.png'
import { MenuItem } from 'shared/components/elements'
import { Link } from 'react-router-dom'

const NavbarBrand = ({ background }) => {
  return (
    <Link to="/">
      <div className={classes.brand} >
        <img alt="logo" src={logo} />
      </div>
    </Link>
  )
}

NavbarBrand.propTypes = {
}
export default NavbarBrand

