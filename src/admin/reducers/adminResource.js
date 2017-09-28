import {
  UPDATE_FIREBASE,
} from 'constants/actionTypes'

export default (state = null, action) => {

  switch (action.type) {
    case UPDATE_FIREBASE:
      return action.payload

    default:
      return state
  }
}

