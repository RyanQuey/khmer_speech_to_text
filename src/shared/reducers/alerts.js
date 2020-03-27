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

      //TODO: only close one/some alert(s) in action.payload if action.payload === string/integer
      return {}

    default:
      return state
  }
}

