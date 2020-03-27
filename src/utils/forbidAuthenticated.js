import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


export default function(ComposedComponent) {
  class NoAuthentication extends Component {
    constructor() {
      super()

      this.checkAuthentication = this.checkAuthentication.bind(this)
    }
    render() {
      return <ComposedComponent {...this.props} />
    }
    componentWillMount() {
      this.checkAuthentication(this.props)
    }
    componentWillReceiveProps(nextProps) {
      this.checkAuthentication(nextProps)
    }

    checkAuthentication(props) {
      if (props.user && Object.keys(props.user).length > 0) {
        this.props.history.push('/')
      }
    }
  }

  function mapStateToProps(state) {
    return { user: state.user }
  }

  return withRouter(connect(mapStateToProps)(NoAuthentication))
}
