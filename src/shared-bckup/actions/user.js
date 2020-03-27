import firebase from 'refire/firebase'
import generator from 'generate-password'

import schema from 'constants/schema'
import * as actionTypes from 'constants/actionTypes'
import {
  EMAIL,
  CREATE_WITH_EMAIL,
  PROVIDER,
} from 'constants/login'

import {
  FACEBOOK,
  GOOGLE,
} from 'constants/providers'
import errorTypes from 'constants/errors'

import { errorActions } from 'shared/actions'

//if the user cannot be found by the userData.uid, creates a new User newUserData
//TODO: combine this with the generic firebase action
export const findOrCreateUser = (userData) => {

  const userColumns = _.values(Object.keys(schema.tables.users))
  const ref = firebase.database().ref(`users/${userData.uid}`)
  let redirect, creating

  ref.once('value')
  .then((snapshot) => {
    let user
    if (snapshot.val()) {
      user = snapshot.val() 
      return user
    } else {
      //if no values retrieved from database, just return info from the user argument
      // extract out the relevant columns from the userData, and create user
      user = _.pick(userData, ...userColumns)
      creating = true

      //TODO: probably will redirect to a page where they fill out more profile information, basically, signing up.
      //redirect = {path: "/fillInProfile"}  

console.log(user);
console.log(userData, ...userColumns);
      return ref.set(user)
    }
  })
  .then((persistedUser) => {
    if (creating) {
      persistedUser = user
    }

    if (!persistedUser) {
      throw {
        title: "Failure during login:",
        message: "Please refresh the page and try again",
        templateName: "Login",
        templatePart: "onSubmit",
        level: "BUG",
        alert: true,
      }
    }

    const u = Object.assign({}, persistedUser)

    store.dispatch({ 
      type: actionTypes.FETCH_USER, 
      payload: {
        user: u,
      }
    })

    if (redirect && redirect.path) {
      console.log('redirecting')
      user.history.push(redirect.path)
    }

  })
  .catch((err) => {
    console.log('user fetch failed')
    errorActions.handleErrors(err)
  })
}

function _createUserWithEmail(data) {
  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: false,
    uppercase: true,
  })

  // The user data returned by firebase is one level flatter
  // than the user data for an existing user so we have to pass obj
  firebase.auth().createUserWithEmailAndPassword(data.email, password)
  .then((user) => {
    user.history = data.history

    findOrCreateUser(user, true)
  })
  .catch((err) => {
    let toReturn = err
    let options = {
      alert: true
    }
    if (err.code === "auth/email-already-in-use") {
      toReturn = {
        title: "Email already in use",
        message: "Please either login or try a different email",
        errorType: errorTypes.RECORD_ALREADY_EXISTS.type,
        level: errorTypes.RECORD_ALREADY_EXISTS.level,
      }

    }
    errorActions.handleErrors(toReturn, "Login", "onSubmit", options)
  })  
}
function _signInWithEmail(data) {
  firebase.auth().signInWithEmailAndPassword(data.email, data.password)
  .then(user => {

    return user
  })
  .catch((err) => {
    let toReturn = err
    let options = {
      alert: true
    }
    if (err.code === "auth/wrong-password") {
      toReturn = {
        title: "Invalid credentials",
        message: "Please try again or sign-up to create an account",
        errorType: errorTypes.INVALID_CREDENTIALS.type,
        level: errorTypes.INVALID_CREDENTIALS.level,
      }

    }
    errorActions.handleErrors(toReturn, "Login", "onSubmit", options)
  })
}

function _signInWithProvider(data) {
  let authProvider

  switch (data.provider) {
    case FACEBOOK:
      authProvider = new firebase.auth.FacebookAuthProvider()
      break
    case GOOGLE:
      authProvider = new firebase.auth.GoogleAuthProvider()
      break
  }

  firebase.auth().signInWithPopup(authProvider)
  .then((user) => {
    if (data.history) {
      user.history = data.history
    }

    findOrCreateUser(user, true)
  })
  .catch((err) => {
    errorActions.handleErrors(err)
    
  })
}

//also handles sign up
export const signIn = (type, data) => {
  let userData

  switch (type) {
    case CREATE_WITH_EMAIL:
      _createUserWithEmail(data)
      break
    case EMAIL:
      _signInWithEmail(data)
      break
    case PROVIDER:
      _signInWithProvider(data)
      break
  }
}

export const signOut = () => {
  firebase.auth().signOut()
  .then(() => {
    store.dispatch({ type: actionTypes.SIGN_OUT})
  })
  .catch((err) => {
    //TODO: buildout these error objects, this one in the ones above 
    errorActions.handleErrors(err)
  })
}
