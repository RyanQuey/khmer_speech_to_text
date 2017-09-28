import {
  NEW_ALERT,
  CLOSE_ALERTS,
} from 'constants/actionTypes'


export default (state = {}, action) => {
  switch (action.type) {
    case NEW_ALERT:
      let alert = action.payload
      let lastAlertId
      if (Object.keys(state).length >0) {
        let alertCount = Object.keys(state).length 
        lastAlertId = state[Object.keys(state[alertCount -1])].id
      } else {
        lastAlertId = 0
      }
      alert.id = newId
      const newId = state.lastAlertId +1
       
      const toMerge = {
        [newId]: action.payload
      }

      return Object.assign({}, state, toMerge)
    case CLOSE_ALERTS:

      return 
    default:
      return state
  }
}

