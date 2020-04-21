import {
  FETCH_UNTRANSCRIBED_UPLOADS_SUCCESS,
} from 'constants/actionTypes'

const reducer = (state = null, action) => {

  switch (action.type) {
    case FETCH_UNTRANSCRIBED_UPLOADS_SUCCESS:
      return Object.assign({}, action.payload)

    default:
      return state
  }
}

export default reducer

