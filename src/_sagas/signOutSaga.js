import 'babel-polyfill'
import { put, takeLatest } from 'redux-saga/effects'
import firebase from 'refire/firebase'
import { SIGN_OUT_REQUESTED } from 'actions/types'
import { signOut } from 'actions'

function* signUserOut() {
  try {
    const isSignedOut = yield firebase.auth().signOut().then(() => null)

    console.log('isSignedOut?', isSignedOut)
    yield put(signOut(isSignedOut))

  } catch (e) {
    console.log('There was an error in the signUserOut generator function', e.message)
    yield put(signOut('err'))
  }
}

export default function* signOutSaga() {
  yield takeLatest(SIGN_OUT_REQUESTED, signUserOut)
}
