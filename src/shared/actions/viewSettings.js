import {
  SET_CURRENT_MODAL,
  CLOSE_MODAL,
  SET_VIEW_MODE,
  DATA_IS_READY,
} from 'constants/actionTypes'

export const openModal = (modal) => {
  store.dispatch({
    type: SET_CURRENT_MODAL,
    payload: modal
  })
}

//alerts should be an array of alert ids, or 'all' to close all
export const closeModal = () => {
  //TODO: refresh modal state, including closing alerts for this modal
  //might do some of this within the component, but dry as much as possible
  store.dispatch({
    type: CLOSE_MODAL,
  })
}

// for every view mode, except for models
export const setViewMode = (component, mode) => {
  store.dispatch({
    type: SET_VIEW_MODE,
    payload: {component, mode}
  })
}

// generic, catchall for whatever doesn't fit elsewhere...don't overuse
// namespace as necessary
export const dataIsReady = (dataName, boolean) => {
  store.dispatch({
    type: DATA_IS_READY,
    payload: {dataName, boolean}
  })
}
