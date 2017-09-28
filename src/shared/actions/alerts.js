import {
  NEW_ALERT,
  CLOSE_ALERTS,
} from 'constants/actionTypes'

/* {
 *   title: ,
 *   message: ,
 *   level: ,   (same as error levels)
 *   timer: ,   ( Boolean, to automatically close after 5 sec )
 *   onClick: , (a function to call on click)
 * }
 */
export const newAlert = (alert) => {
console.log(alert);
  store.dispatch({
    type: NEW_ALERT,
    payload: alert
  })
}

//alerts should be an array of alert ids, or 'all' to close all
export const closeAlerts = (alerts = 'all') => {
  store.dispatch({
    type: CLOSE_ALERTS,
    payload: alerts
  })
}
