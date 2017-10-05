import { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './style.scss'
import logo from 'images/logo.png'
import { MenuItem } from 'shared/components/elements'
import { Link } from 'react-router-dom'

const NavbarBrand = ({ background }) => {
  return (
    <div className={classes.brand} >
      <Link to="/">
        <img alt="logo" src={logo} />
      </Link>
    </div>
  )
}

NavbarBrand.propTypes = {
}
export default NavbarBrand

