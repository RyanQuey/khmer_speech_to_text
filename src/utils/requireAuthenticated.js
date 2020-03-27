import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


export default function(ComposedComponent) {
  class Authentication extends Component {
    constructor() {
      super()

      this.checkAuthentication = this.checkAuthentication.bind(this)
    }
    componentWillMount() {
      this.checkAuthentication(this.props)
    }
    componentWillReceiveProps(nextProps) {
      this.checkAuthentication(nextProps)
    }

    checkAuthentication(props) {
      if (!props.user || Object.keys(props.user).length === 0) {
        //TODO: can probably use /login
        //also send an alert
        this.props.history.push('/')
      }
    }
    
    render() {
      if (!this.props.user) {
        return null
      }
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { user: state.user }
  }

  return withRouter(connect(mapStateToProps)(Authentication))
}
