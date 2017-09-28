import {
  UPDATE_FIREBASE,
} from 'constants/actionTypes'

export default (state = null, action) => {

  switch (action.type) {
    case UPDATE_FIREBASE:
      return Object.assign({}, state, { [action.inputData.name]: action.inputData.value })
    default:
      return state
  }
}

