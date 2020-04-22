import {
  FETCH_TRANSCRIBE_REQUESTS_SUCCESS,
} from 'constants/actionTypes'

const reducer = (state = null, action) => {

  switch (action.type) {
    case FETCH_TRANSCRIBE_REQUESTS_SUCCESS:
      return Object.assign({}, action.payload)

    default:
      return state
  }
}

export default reducer

