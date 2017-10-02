import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Flexbox } from 'shared/components/elements'
import classes from './Navbar.scss'

const Navbar = ({ children, color}) => {
  return (
    <Flexbox align="center" className={classes.navbar} background={color} justify="flex-end" >
      {children}
    </Flexbox>
  )
}

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
}
export default Navbar
