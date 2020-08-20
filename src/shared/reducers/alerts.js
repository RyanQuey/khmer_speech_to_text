import {
  NEW_ALERT,
  CLOSE_ALERTS,
} from 'constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case NEW_ALERT:
      let alert = action.payload
      return Object.assign({}, state, alert)

    case CLOSE_ALERTS:

      if (action.payload == "all") {
        return {}
      } else {
        // only close the alert by the key passed in
        let newState = Object.assign({}, state)
        delete newState[action.payload]
        return newState
      }


    default:
      return state
  }
}

