import { Component } from 'react'
import { Authenticated, Unauthenticated } from './yields'
import { connect } from 'react-redux'
import {
  withRouter,
} from 'react-router-dom'

class App extends Component {
  //not really sure what this is
  componentDidMount() {
    //console.log('Unsubscribing from Firebase_Auth_Change and Preload_Store Observers')
    //unsubscribeAuth()
  }
  render() {
    return (
      <div>
        {this.props.user ? (
          <Authenticated />
        ) : (
          <Unauthenticated />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(App))
