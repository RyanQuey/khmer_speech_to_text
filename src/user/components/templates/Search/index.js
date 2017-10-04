import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Search extends Component {
  render() {
    const { user } = this.props
    return (
      <div id="home-ctn">
        <div className="menu-ctn">
        </div>
        <h1>Search</h1>
      </div>
    )
  }
}

Search.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { user: state.shared.user }
}

export default connect(mapStateToProps)(Search)

