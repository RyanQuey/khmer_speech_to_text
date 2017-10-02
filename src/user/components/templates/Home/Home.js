import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Heading } from 'shared/components/elements'
import { SignIn } from 'shared/components/partials'
import { connect } from 'react-redux'

class Home extends Component {
  render() {
    const { user } = this.props
    return (
      <div id="home-ctn">
        <div className="menu-ctn">
        </div>
        <Heading level={1}>You are Home</Heading>
      </div>
    )
  }
}

Home.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { user: state.shared.user }
}

export default withRouter(connect(mapStateToProps)(Home))
