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
  USER_COLUMNS,
} from 'utils/constants'

import { 
  FETCH_USER, 
  SIGN_OUT, 
  SIGN_IN, 
  SET_CURRENT_USER 
} from 'actions/types'

function _createUserWithEmail(data) {
console.log(" digit now crating user");
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
    Helpers.notifyOfAPIError(err)
  })  
}
function _signInWithEmail(data) {
console.log("nice-sounding in");
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
console.log(user);
    user.redirect = true
    if (data.history) {
      user.history = data.history
    }
    return user
  })
  .catch((err) => {
    Helpers.notifyOfAPIError(err)
    
  })
}

//if the user cannot be found by the userData.uid, creates a new User newUserData
export const findOrCreateUser = (userData, redirect) => {
  const userColumns = _.values(USER_COLUMNS)
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
    const u = Object.assign({}, persistentUser)

    store.dispatch({ 
      type: FETCH_USER, 
      payload: {
        user: u,
        result: SUCCESS
      }
    })

    if (redirect && redirect.path) {
      console.log('redirecting')
      user.history.push(redirect.path)
    }

  })
  .catch((err) => {
    console.log('user fetch failed')
    Helpers.notifyOfAPIError(err)
  })
}

//also handles sign up
export const signIn = (type, data) => {
  let returnedUser

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
    //in case the user already has some data persisted in our database
  } else {
    //return an error
    console.log("user not found or created");
  }

}
//
//I don't think we ever have to use this one
export const setCurrentUser = user => (
  { type: SET_CURRENT_USER, payload: user }
)
export const signOut = isSignedOut => (
  { type: SIGN_OUT, payload: isSignedOut }
)
