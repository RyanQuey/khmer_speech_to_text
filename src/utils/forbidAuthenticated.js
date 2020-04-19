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
    componentDidMount() {
      this.checkAuthentication(this.props)
    }
    // TODO fix by moving to getDerivedStateFromProps
    // componentWillReceiveProps(nextProps) {
    //  this.checkAuthentication(nextProps)
    // }

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
