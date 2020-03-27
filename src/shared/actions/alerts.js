import {
  NEW_ALERT,
  CLOSE_ALERTS,
} from 'constants/actionTypes'


//alerts should be an array of alert ids, or 'all' to close all
export const closeAlerts = (alerts = 'all') => {
  store.dispatch({
    type: CLOSE_ALERTS,
    payload: alerts
  })
}

/* {
 *   title: ,
 *   message: ,
 *   level: ,   (same as error levels)(one of "ALERT", "WARNING", "DANGER", "BUG") (don't know if we want this)
 *   timer: ,   ( Boolean, to automatically close after 3 sec ) (defaults to true)
 *   onClick: , (a function to call on click)
 * }
 */
export const newAlert = (alert) => {
  const currentState = store.getState()
  const alertState = currentState.alerts

  if (!alert.options) {
    alert.options = {timer: true}
  } else if (alert.options.timer !== false) { //in case there are options, but not for timer
    alert.options.timer = true
  }

  let lastAlertId
  if (Object.keys(alertState).length >0) {
    const alertCount = Object.keys(alertState).length
    lastAlertId = Math.max(Object.keys(alertState))
  } else {
    lastAlertId = 0
  }

  const newId = lastAlertId +1
  alert.id = newId

  //designate this alert for the modal if it's open
  //don't need to designate this option for non-modal components...at least for now
  const currentModal = Helpers.safeDataPath(currentState, "viewSettings.currentModal", false)
  if (currentModal && !alert.options.forComponent) {
    alert.options.forComponent = currentModal
  }

  const payload = {
    [newId]: alert
  }

  store.dispatch({
    type: NEW_ALERT,
    payload,
  })

  if (alert.options.timer) {
    setTimeout(() => {
      closeAlerts(newId)
    }, 5000)
  }
}
