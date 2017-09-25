import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Heading } from 'shared/components/elements'
import { SignIn, UserMenu } from 'shared/components/partials'
import { connect } from 'react-redux'

class Home extends Component {
  componentDidUpdate(prevProps) {
    const { user, history } = this.props

    if (user && !prevProps.user && history.location.pathname === '/') {
      this.props.history.push('/profile')
    }
  }
  render() {
    const { user } = this.props
    return (
      <div id="home-ctn">
        <div className="menu-ctn">
          {user ? <UserMenu /> : <SignIn />}
        </div>
        <Heading level={1}>You are Home</Heading>
        <div id="firebaseui-auth-container" />
      </div>
    )
  }
}

Home.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(Home))
