//this will have all the "outdated" hooks.
//if something is triggered as outdated, look here for what happens
//
//will ONLY call other events

import { call, put, takeLatest, all } from 'redux-saga/effects'
import {
  CURRENT_USER_OUTDATED,

  FETCH_USER_REQUEST,
  FETCH_CURRENT_USER_REQUEST,
}  from 'constants/actionTypes'

export default function* hooksSaga() {}
