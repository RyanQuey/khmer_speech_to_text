import { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './style.scss'
import { Flexbox } from 'shared/components/elements'

const NavbarList = ({ background, children }) => {
  return (
    <Flexbox className={classes.list} >
      {children}
    </Flexbox>
  )
}

NavbarList.propTypes = {
}
export default NavbarList

