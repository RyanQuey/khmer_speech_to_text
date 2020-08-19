import { Component } from 'react'
import PropTypes from 'prop-types'
import { Heading } from 'shared/components/elements'
import { SignIn } from 'shared/components/partials'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class Home extends Component {
  render() {
    const { user } = this.props
    return (
      <div id="home-ctn">
        <div className="menu-ctn">
          <h1>Head over to uploads page to upload a file</h1>
        </div>
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
