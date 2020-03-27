import { all, call } from 'redux-saga/effects'
import eventHooksSaga from './eventHooksSaga'
import userSaga from './userSaga'


export default function* rootSaga() {
  yield all([
    call(eventHooksSaga),
    call(userSaga),
  ])
}
