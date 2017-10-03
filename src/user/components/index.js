import { Component } from 'react'
import { Authenticated, Unauthenticated } from './yields'


export default class App extends Component {
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

