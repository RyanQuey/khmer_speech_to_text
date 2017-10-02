import { Component } from 'react'
import { Authenticated, Unauthenticated } from './yields'

import 'theme/normalize.css'
import 'theme/Global.scss'

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

