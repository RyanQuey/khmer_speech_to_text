import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Flexbox } from 'shared/components/elements'
import classes from './Navbar.scss'

class Navbar extends Component {
  render() {
    return (
      <Flexbox align="center" className={classes.navbar} background={this.props.color} justify="flex-end" >
        {this.props.children}
      </Flexbox>
    )
  }
}

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default connect(mapStateToProps)(Navbar)
