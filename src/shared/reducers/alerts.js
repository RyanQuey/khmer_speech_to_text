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
        const alertCount = Object.keys(state).length 
        const lastAlert = state[alertCount -1]
        lastAlertId = state[newAlertId].id
      } else {
        lastAlertId = 0
      }

      const newId = lastAlertId +1
      alert.id = newId
       
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

