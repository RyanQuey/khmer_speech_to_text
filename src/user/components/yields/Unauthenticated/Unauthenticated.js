import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Flexbox } from 'shared/components/elements'
import classes from './Unauthenticated.scss'

export default class SignUpTemplate extends Component {
  render() {
    const { children } = this.props
    return (
      <Flexbox className={classes.mainContainer} justify="center" align="center" flexWrap="wrap">
        <main>
          <Flexbox className={classes.content} justify="center" flexWrap="wrap">
            {children}
          </Flexbox>
        </main>
      </Flexbox>
    )
  }
}

SignUpTemplate.propTypes = {
  children: PropTypes.node.isRequired,
}
