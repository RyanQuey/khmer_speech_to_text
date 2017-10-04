import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import watch from 'redux-watch'

import firebase from 'refire/firebase'

import AdminComponent from 'admin/components'
import UserComponent from 'user/components'

import sharedInitializers from './shared/initializers'
import adminInitializers from './admin/initializers'
import userInitializers from './user/initializers'

import refire from './refire'

import adminCombiner from 'admin/reducers'
import sharedCombiner from 'shared/reducers'
import userCombiner from 'user/reducers'

import 'theme/index.scss'

import _ from 'lodash'

window._ = _

window.React = React

const combined = combineReducers({
  admin: adminCombiner,
  user: userCombiner,
  shared: sharedCombiner
})
window.store = createStore(combined, composeWithDevTools(
//  applyMiddleware(refire)
))

sharedInitializers()

refire()

const url = location.href
const isAdmin = url.includes('//admin.')

if (isAdmin){
  adminInitializers()
} else {
  userInitializers()
}

ReactDOM.render(
  <Provider store={store}>
    <div>
      {isAdmin ? (
        <AdminComponent />
      ) : (
        <UserComponent />
      )}
    </div>
  </Provider>,
  document.querySelector("#app")
)
