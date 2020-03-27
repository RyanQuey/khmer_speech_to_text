import {
  SET_CURRENT_MODAL,
  CLOSE_MODAL,
  SET_VIEW_MODE,
  DATA_IS_READY,
} from 'constants/actionTypes'

//separate out by template the error was made in (even if it will be handled in a different template also)

export default (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_MODAL:
      return Object.assign({}, state, {currentModal: action.payload, modalToken: action.token, modalOptions: action.options})

    case CLOSE_MODAL:
      return Object.assign({}, state, {currentModal: false})

    case SET_VIEW_MODE:
      return Object.assign({}, state, {[action.payload.component]: action.payload.mode})

    case DATA_IS_READY:
      return Object.assign({}, state, {dataIsReady: {[action.payload.dataName]: action.payload.boolean}})

    default:
      return state
  }
}

