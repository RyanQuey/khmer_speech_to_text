import {
  UPDATE_FIREBASE,
  LOG_IN_WITH_PROVIDER,
  SET_CURRENT_USER,
  SET_IMAGE,
  SIGN_OUT,
  FETCH_USER,
} from 'constants/actionTypes'

export default (state = null, action) => {

  switch (action.type) {
    case LOG_IN_WITH_PROVIDER:
      return action.payload

    case SET_CURRENT_USER:
      return action.user

    case SET_IMAGE:
      return Object.assign({}, state, { [action.data.name]: action.data.url })

    case UPDATE_FIREBASE:
      return Object.assign({}, state, { [action.inputData.name]: action.inputData.value })

    case SIGN_OUT:
      return action.isSignedOut ? state : null

    case FETCH_USER:
      console.log('Merged user auth and user data into store ===>', action.user)
      return Object.assign({}, state, action.user)

    default:
      return state
  }
}

