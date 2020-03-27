import {
  UPDATE_FIREBASE,
  LOG_IN_WITH_PROVIDER,
  SET_CURRENT_USER,
  SET_IMAGE,
  SIGN_OUT,
  FETCH_USER,
} from 'constants/actionTypes'

export default (state = null, action) => {

//TODO: make it consistent and only attach data to action.payload
  switch (action.type) {
    case LOG_IN_WITH_PROVIDER:
      return action.payload

    case SET_IMAGE:
      if (action.payload.path.split("/")[0] === "users") {
        return Object.assign({}, state, { [action.payload.name]: action.payload.url })      
      }

    case UPDATE_FIREBASE:
      if (action.payload.path) {}
      return Object.assign({}, state, { [action.inputData.name]: action.inputData.value })

    case SIGN_OUT:
      return action.isSignedOut ? state : null

    case FETCH_USER:
      return Object.assign({}, state, action.payload.user)

    default:
      return state
  }
}

