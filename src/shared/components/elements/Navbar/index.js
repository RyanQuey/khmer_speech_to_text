import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Flexbox } from 'shared/components/elements'
import classes from './style.scss'

const Navbar = ({ children, background = "white", color = "text", justify = "space-between", className = "", tabs = false, justifyTabs = "flex-start"}) => {
  return (
    <Flexbox align="center" className={`${classes.navbar} ${className} ${tabs ? classes.navTabs : ""} ${classes[justifyTabs]}`} background={background} color={color} justify={justify} >
      {children}
    </Flexbox>
  )
}

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  justify: PropTypes.string,
}
export default Navbar
