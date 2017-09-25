import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUserWithEmail } from 'actions/auth'

class Home extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div></div>
    )
  }
}

const mapStateToProps = (state) => {
  return { reduxProp: state.reduxProp }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ createUserWithEmail }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
