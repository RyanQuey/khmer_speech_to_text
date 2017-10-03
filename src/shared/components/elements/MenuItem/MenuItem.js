import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'
import classes from './MenuItem.scss'

const MenuItem = ({ children, link, nav }) => (
  <li className={classes.menuItem}>
    {link && nav && 
      <NavLink to={link} activeClassName={classes.navActive}>
        {children}
      </NavLink>
    }
    {link && !nav && 
      <Link to={link}>
        {children}
      </Link>
    }
    {!link && 
      <span>
        {children}
      </span>
    }
  </li>
)

MenuItem.propTypes = {
  children: PropTypes.node,
  link: PropTypes.string,
  nav: PropTypes.bool,
}

export default MenuItem
