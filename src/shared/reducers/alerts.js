import {
  NEW_ALERT,
  CLOSE_ALERTS,
} from 'constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case NEW_ALERT:
      let alert = action.payload
      if (!alert.options) {
        alert.options = {}
      }

      let lastAlertId
      if (Object.keys(state).length >0) {
        const alertCount = Object.keys(state).length 
        const lastAlert = state[alertCount -1]
        lastAlertId = state[newAlertId].id
      } else {
        lastAlertId = 0
      }

      const newId = lastAlertId +1
      alert.id = newId

      //designate this alert for the modal if it's open
      //don't need to designate this option for non-modal components...at least for now
      const currentState = store.getState()
      const currentModal = Helpers.safeDataPath(currentState, "shared.viewSettings.currentModal", false)
      if (currentModal && !alert.options.forComponent) {
        alert.options.forComponent = currentModal
      }
       
      const toMerge = {
        [newId]: alert
      }

      return Object.assign({}, state, toMerge)
    case CLOSE_ALERTS:

      //TODO: only close the alerts in action.payload unless action.payload === "all"
      return {}

    default:
      return state
  }
}

