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
      return Object.assign({}, state, { [action.data.name]: action.data.url })

    case UPDATE_FIREBASE:
      return Object.assign({}, state, { [action.inputData.name]: action.inputData.value })

    case SIGN_OUT:
      return action.isSignedOut ? state : null

    case FETCH_USER:
      return Object.assign({}, state, action.payload.user)

    default:
      return state
  }
}

