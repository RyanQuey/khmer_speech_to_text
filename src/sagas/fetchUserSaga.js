import 'babel-polyfill'
import { omit, values } from 'underscore'
import { call, put, takeLatest } from 'redux-saga/effects'
import firebase from 'refire/firebase'
import { isPreloadingStore, userFetchFailed, userFetchSucceeded } from 'actions'
import { USER_FETCH_REQUESTED } from 'actions/types'
import { FIELDS } from 'utils/constants'

function* getVals(userAuthInfo) {
  const properties = values(FIELDS)

  const ref = firebase.database().ref(`users/${userAuthInfo.uid}`)

  const userData = yield ref.once('value').then((snapshot) => {
    // If snapshot.val() is not undefined, user has signed in before
    if (snapshot.val()) {
      const vals = {}

      properties.forEach((property) => {
        if (snapshot.val()[property]) {
          vals[property] = snapshot.val()[property]
        }
      })

      return vals
    }

    ref.set(omit(userAuthInfo, 'uid'))
    return {}
  })

  return userData
}

function* fetchUserData(action) {
  try {
    const userAuthInfo = {
      displayName: action.user.displayName,
      email: action.user.email,
      photoURL: action.user.photoURL,
      uid: action.user.uid,
    }
    const userData = yield call(getVals, userAuthInfo)
    const user = Object.assign({}, userAuthInfo, userData)

    yield put(userFetchSucceeded(user))
    yield put(isPreloadingStore(false))

    if (action.user.redirect) {
      console.log('redirecting')
      action.user.history.push('/signup/create-account/step-1')
    }

  } catch (err) {
    console.log('user fetch failed', err)
    yield put(userFetchFailed(err.message))
  }
}

export default function* fetchUserSaga() {
  yield takeLatest(USER_FETCH_REQUESTED, fetchUserData)
}
