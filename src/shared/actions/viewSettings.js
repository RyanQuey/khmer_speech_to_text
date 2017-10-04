import {
  SET_CURRENT_MODAL
} from 'constants/actionTypes'

export const openModal = (modal) => {
  store.dispatch({
    type: SET_CURRENT_MODAL,
    payload: modal
  })
}

//alerts should be an array of alert ids, or 'all' to close all
export const closeModal = () => {
  store.dispatch({
    type: SET_CURRENT_MODAL,
    payload: false
  })
}
