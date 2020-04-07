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

import firebase from 'firebase'
require("firebase/firestore");

import firebaseApp from 'refire/firebase'
import refire from './refire'

import UserComponent from 'user/components'
import Helpers from 'helpers'
import initializers from './user/initializers'
import 'prototypeHelpers'
import store from 'shared/reducers'
import 'theme/index.scss'
import App from './App';

window.db = firebaseApp.firestore();
window.Helpers = Helpers
window._ = _
window.moment = moment
window.React = React
window.firebase = firebase
window.firebaseApp = firebaseApp
window.$ = jQuery

// to hit the cloud func server
// NOTE make sure that the local server isn't running on hostname that includes "khmer-speech-to-text" 
window.endpoint = window.location.hostname.includes("khmer-speech-to-text") ? "https://us-central1-khmer-speech-to-text.cloudfunctions.net" : `http://${window.location.hostname}:5000/khmer-speech-to-text/us-central1`
const axiosInstance = axios.create({
  baseURL: endpoint,
  //timeout: 10*1000, // 10 sec. for longer operations, poll it instead of leaving it open
  timeout: 10*1000, // 10 sec. for longer operations, poll it instead of leaving it open
  headers: {
    //'Content-Type': 'multipart/form-data'
    //'Content-Type': 'multipart/form-data; boundary="--this is a test boundary--"'
   'Content-Type': 'application/json'
  }

})
// delete axiosInstance.defaults.headers.common["Content-Type"]; // hacky trick that might not have even worked
window.axios = axiosInstance;

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
