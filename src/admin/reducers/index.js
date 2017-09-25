import { combineReducers } from 'redux'
import adminResourceReducer from './adminResource'

const adminReducer = combineReducers({
  adminResource: adminResourceReducer,
})

export default adminReducer
