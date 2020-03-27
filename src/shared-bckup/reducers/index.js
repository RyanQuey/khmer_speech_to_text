import { combineReducers } from 'redux'
import userReducer from './user'
import errorReducer from './errors'
import alertReducer from './alerts'
import viewSettingsReducer from './viewSettings'

const sharedReducer = combineReducers({
  user: userReducer,
  errors: errorReducer,
  alerts: alertReducer,
  viewSettings: viewSettingsReducer,
})

export default sharedReducer
