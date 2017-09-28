import { combineReducers } from 'redux'
import userReducer from './user'
import errorReducer from './errors'
import alertReducer from './alerts'

const sharedReducer = combineReducers({
  user: userReducer,
  errors: errorReducer,
  alerts: alertReducer,
})

export default sharedReducer
