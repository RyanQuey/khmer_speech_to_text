import {
  SET_CURRENT_MODAL
} from 'constants/actionTypes'

//separate out by template the error was made in (even if it will be handled in a different template also)

export default (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_MODAL:
      return Object.assign({}, state, {currentModal: action.payload})

    default:
      return state
  }
}

