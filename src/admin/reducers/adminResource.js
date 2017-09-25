import {
  INPUT_UPDATE_SUCCESSFUL,
  LOG_IN_WITH_PROVIDER,
  SET_CURRENT_USER,
  SET_IMAGE,
  SIGN_OUT,
  USER_FETCH_SUCCEEDED,
} from 'actions/types'

const userReducer = (state = null, action) => {

  switch (action.type) {
    case LOG_IN_WITH_PROVIDER:
      return action.payload

    case SET_CURRENT_USER:
      return action.user

    case SET_IMAGE:
      return Object.assign({}, state, { [action.data.name]: action.data.url })

    case INPUT_UPDATE_SUCCESSFUL:
      return Object.assign({}, state, { [action.inputData.name]: action.inputData.value })

    case SIGN_OUT:
      return action.isSignedOut ? state : null

    case USER_FETCH_SUCCEEDED:
      console.log('Merged user auth and user data into store ===>', action.user)
      return Object.assign({}, state, action.user)

    default:
      return state
  }
}

export default userReducer
