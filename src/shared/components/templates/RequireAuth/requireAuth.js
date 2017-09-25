import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


export default function(ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (!this.props.user) {
        this.props.history.push('/')
      }
    }
    componentWillReceiveProps(nextProps) {
      if (!nextProps.user) {
        this.props.history.push('/')
      }
    }
    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { user: state.user }
  }

  return withRouter(connect(mapStateToProps)(Authentication))
}
