import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import LandingPage from './LandingPage'
import CreateAccount from './CreateAccount'
import SetDisplayName from './SetDisplayName'

export default class SignUp extends Component {
  render() {
    return (
      <Switch>
        <Route path="/signup/create-account/step-1" component={SetDisplayName} />
        <Route path="/signup/create-account" component={CreateAccount} />
        <Route path="/signup" component={LandingPage} />
      </Switch>
    )
  }
}
