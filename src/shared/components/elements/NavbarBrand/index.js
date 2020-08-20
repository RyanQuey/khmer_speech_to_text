import { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './style.scss'
import { Logo } from 'shared/components/elements'
import { Link } from 'react-router-dom'

const NavbarBrand = ({ background }) => {
  return (
    <div className={classes.brand} >
      <Link id="navbar-brand-link" className={classes.navBrandLink} to="/">
        <Logo />
        <div className={classes.brandName}>Khmer Voice App</div>
      </Link>
    </div>
  )
}

NavbarBrand.propTypes = {
}
export default NavbarBrand

