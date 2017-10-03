import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Flexbox } from 'shared/components/elements'
import classes from './Navbar.scss'

const Navbar = ({ children, color, justify}) => {
  return (
    <Flexbox align="center" className={classes.navbar} background={color} justify={justify || "space-between"} >
      {children}
    </Flexbox>
  )
}

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  justify: PropTypes.string,
}
export default Navbar
