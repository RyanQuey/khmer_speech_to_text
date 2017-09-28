import firebase from 'refire/firebase'
import generator from 'generate-password'

import schema from 'constants/schema'
import * as actionTypes from 'constants/actionTypes'
import {
  EMAIL,
  CREATE_WITH_EMAIL,
  PROVIDER,
} from 'constants/signIn'

import {
  FACEBOOK,
  GITHUB,
  GOOGLE,
} from 'constants/providers'
import errorTypes from 'constants/errors'

import { errorActions } from 'shared/actions'

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
    console.log(user);
    user.redirect = true
    user.history = data.history

    return user
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
        errorLevel: errorTypes.RECORD_ALREADY_EXISTS.level,
      }

    }
    errorActions.handleErrors("Login", "onSubmit", toReturn, options)
  })  
}
function _signInWithEmail(data) {
  firebase.auth().signInWithEmailAndPassword(data.email, data.password)
  .then(user => {

    return user
  })
  .catch((err) => {
    errorActions.handleErrors(err)
  })
}

function _signInWithProvider(data) {
  let authProvider

  switch (data.provider) {
    case providerConstants.FACEBOOK.name:
      authProvider = new firebase.auth.FacebookAuthProvider()
      break
    case providerConstants.GITHUB.name:
      authProvider = new firebase.auth.GithubAuthProvider()
      break
    case providerConstants.GOOGLE.name:
      authProvider = new firebase.auth.GoogleAuthProvider()
      break
  }

  firebase.auth().signInWithPopup(authProvider)
  .then((user) => {
console.log(user);
    user.redirect = true
    if (data.history) {
      user.history = data.history
    }
    return user
  })
  .catch((err) => {
    errorActions.handleErrors(err)
    
  })
}

//if the user cannot be found by the userData.uid, creates a new User newUserData
export const findOrCreateUser = (userData, redirect) => {
  const userColumns = _.values(Object.keys(schema.tables.users))
  const ref = firebase.database().ref(`users/${userData.uid}`)

  ref.once('value')
  .then((snapshot) => {
    let user

    if (snapshot.val()) {
      //is no values retrieved from database, just return info from the payload
      user = snapshot.val() // || _.pick(pld, ...userColumns)
      return user
    } else {
      // extract out the relevant columns from the userData, and create user
      user = _.pick(userData, ...userColumns)

      //TODO: probably will redirect to a page where they fill out more profile information, basically, signing up.
      return ref.set(user)
    }
  })
  .then((persistedUser) => {
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

//also handles sign up
export const signIn = (type, data) => {
  let returnedUser

  switch (type) {
    case CREATE_WITH_EMAIL:
      returnedUser = _createUserWithEmail(data)
      break
    case EMAIL:
      returnedUser = _signInWithEmail(data)
      break
    case PROVIDER:
      returnedUser = _signInWithProvider(data)
      break
  }
  
  if (returnedUser) {
    const userAuthData = {
      displayName: returnedUser.displayName ? returnedUser.displayName : null,
      email: returnedUser.email,
      history: returnedUser.history || false,
      photoURL: returnedUser.photoURL ? returnedUser.photoURL : null,
      uid: returnedUser.uid,
    }
    const redirect = returnedUser.redirect || false 

    console.log('user auth data', userAuthData)
    findOrCreateUser(userAuthData, redirect)
    //in case the user already has some data persisted in our database
  } else {
    //return an error
    console.log("user not found or created");
  }

}
//
//I don't think we ever have to use this one
export const setCurrentUser = user => (
  { type: actionTypes.SET_CURRENT_USER, payload: user }
)
export const signOut = isSignedOut => (
  { type: actionTypes.SIGN_OUT, payload: isSignedOut }
)
