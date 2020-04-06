import {
  CREATE_DRAFT_SUCCESS,
  INPUT_UPDATE_SUCCESS,
  LINK_ACCOUNT_SUCCESS,
  LOG_IN_WITH_PROVIDER,
  SET_CURRENT_USER,
  SET_IMAGE,
  SIGN_OUT_SUCCESS,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  FETCH_USER_SUCCESS,
  UPDATE_USER_SUCCESS,

} from 'constants/actionTypes'

const userReducer = (state = null, action) => {

  switch (action.type) {
    case LINK_ACCOUNT_SUCCESS:
      return Object.assign({}, state, { providerData: action.payload.providerData })

    case SET_CURRENT_USER:
      return Object.assign({}, action.payload)

    case UPDATE_USER_SUCCESS:
      return Object.assign({}, action.payload)

    case SET_IMAGE:
      return Object.assign({}, state, { [action.payload.name]: action.payload.url })

    case SIGN_OUT_SUCCESS:
      return false

    case FETCH_USER_SUCCESS:
      return Object.assign({}, state, action.payload)

    case SIGN_IN_SUCCESS:
      return Object.assign({}, state, action.payload)

    default:
      return state
  }
}

export default userReducer

