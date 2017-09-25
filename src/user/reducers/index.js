import { combineReducers } from 'redux'
import userResourceReducer from './userResource'

const userReducer = combineReducers({
  userResource: userResourceReducer,
})

export default userReducer
