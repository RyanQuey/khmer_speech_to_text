import { combineReducers } from 'redux'
import userReducer from './user'

const sharedReducer = combineReducers({
  user: userReducer,
})

export default sharedReducer
