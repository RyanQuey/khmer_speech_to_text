import React, { Component } from 'react'
import babel from 'babel-polyfill'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import axios from 'axios'
import {
  BrowserRouter,
} from 'react-router-dom'
import watch from 'redux-watch'
import _ from 'lodash'
import moment from 'moment'

import firebase from 'refire/firebase'
import refire from './refire'

import UserComponent from 'user/components'
import Helpers from 'helpers'
import initializers from './user/initializers'
import store from 'shared/reducers'
import 'theme/index.scss'
import App from './App';

window.Helpers = Helpers
window._ = _
window.axios = axios;
window._ = _
window.moment = moment
window.React = React
window.firebase = firebase
console.log(firebase)

// If don't use middleware, just use dev tools enhancer
//window.store = createStore(combined, composeWithDevTools(
//  applyMiddleware(refire)
//))

initializers()

refire()

const url = location.href
const root = document.getElementById('app')

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>, root
);
