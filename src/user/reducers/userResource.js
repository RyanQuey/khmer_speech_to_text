import {
  INPUT_UPDATE,
  LOG_IN_WITH_PROVIDER,
  CURRENT_USER_SET,
  SET_IMAGE,
  SIGN_OUT,
  USER_FETCH,
} from 'actions/types'

const userReducer = (state = null, action) => {

  switch (action.type) {
    case LOG_IN_WITH_PROVIDER:
      return action.payload

    case CURRENT_USER_SET:
      return action.user

    case SET_IMAGE:
      return Object.assign({}, state, { [action.data.name]: action.data.url })

    case INPUT_UPDATE:
      return Object.assign({}, state, { [action.inputData.name]: action.inputData.value })

    case SIGN_OUT:
      return action.isSignedOut ? state : null

    case USER_FETCH:
      console.log('Merged user auth and user data into store ===>', action.user)
      return Object.assign({}, state, action.user)

    default:
      return state
  }
}

export default userReducer
