import { combineReducers } from 'redux'
import userReducer from './user'
import errorReducer from './errors'

const sharedReducer = combineReducers({
  user: userReducer,
  errors: errorReducer,
})

export default sharedReducer
