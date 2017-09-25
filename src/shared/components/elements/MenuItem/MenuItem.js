import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classes from './MenuItem.scss'

const MenuItem = ({ children, link }) => (
  <Link to={link} className={classes.menuItem}>
    <li>
      {children}
    </li>
  </Link>
)

MenuItem.propTypes = {
  children: PropTypes.node,
  link: PropTypes.string,
}

export default MenuItem
