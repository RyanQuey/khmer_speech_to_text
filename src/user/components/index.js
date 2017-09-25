import React, { Component } from 'react'
import { Home, Profile, SignUp } from 'user/components/templates'
import { RequireAuth } from 'shared/components/templates'

import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom'

import 'theme/normalize.css'
import 'theme/Global.scss'
//import { unsubscribeAuth } from '../../'

export default class App extends Component {
  //not really sure what this is
  componentDidMount() {
    //console.log('Unsubscribing from Firebase_Auth_Change and Preload_Store Observers')
    //unsubscribeAuth()
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" component={RequireAuth(Profile)} />
            <Route path="/signup" component={SignUp} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

