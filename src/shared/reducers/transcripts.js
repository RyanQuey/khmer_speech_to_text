import {
  FETCH_TRANSCRIPTS_SUCCESS,
} from 'constants/actionTypes'

const reducer = (state = null, action) => {

  switch (action.type) {
    case FETCH_TRANSCRIPTS_SUCCESS:
      return Object.assign({}, action.payload)

    default:
      return state
  }
}

export default reducer

