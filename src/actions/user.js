import firebase from 'refire/firebase'
import generator from 'generate-password'

import {
  CREATE_USER,
  EMAIL,
  FACEBOOK,
  GITHUB,
  GOOGLE,
  NEW_EMAIL,
  PROVIDER,
  SUCCESS,
} from 'utils/constants'

import { FETCH_USER, SIGN_OUT, SIGN_IN, SET_CURRENT_USER } from 'actions/types'

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
    user.redirect = true
    user.history = data.history

    return user
  })
  .catch((err) => {
    Helpers.notifyOfAPIError(err)
  })  
}
function _signInWithEmail(data) {
  firebase.auth().signInWithEmailAndPassword(data.email, data.password)
  .then(user => {

    return user
  })
  .catch((err) => {
    Helpers.notifyOfAPIError(err)
  })
}

function _signInWithProvider(data) {
  let authProvider

  switch (data.provider) {
    case FACEBOOK:
      authProvider = new firebase.auth.FacebookAuthProvider()
      break
    case GITHUB:
      authProvider = new firebase.auth.GithubAuthProvider()
      break
    case GOOGLE:
      authProvider = new firebase.auth.GoogleAuthProvider()
      break
  }

  firebase.auth().signInWithPopup(authProvider)
  .then((user) => {
    user.redirect = true
    if (data.history) {
      user.history = data.history
    }
    return user
  })
}


export const currentUserSet = user => (
  { type: SET_CURRENT_USER, payload: user }
)
export const signOut = isSignedOut => (
  { type: SIGN_OUT, payload: isSignedOut }
)

export const signIn = (type, data) => {
  const fetchUser = user => (
    { 
      type: FETCH_USER, 
      payload: {
        user,
        result: SUCCESS
      }
    }
  )


  switch (type) {
    case CREATE_USER:
      returnedUser = _createUserWithEmail(data)
      break
    case EMAIL:
      returnedUser = _signInWithEmail(data)
      break
    case NEW_EMAIL:
      returnedUser = _createUserWithEmail(data)
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
      redirect: returnedUser.redirect || false,
      uid: returnedUser.uid,
    }

    console.log('user auth data', userAuthData)
    store.dispatch(fetchUser(userAuthData))
  } else {
    store.dispatch(fetchUser(null))
  }

}
