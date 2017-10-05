import theme from 'theme'
import classes from './style.scss'

export default ({ alert, className, color, ...props }) => {
  let borderStyle = {}
  //TODO: maybe create a parent component, that goes around all of the alerts
  //TODO: if alert.timer send the action to close alert.id after five seconds or so
  let level
  if (["BUG", "DANGER"].includes(alert.level)) {
    level = 'danger'
  } else if (alert.level === "ALERT") {
    level = "success"
  } else if (alert.level === "WARNING") {
    level = "warning"
  }

  return (
    <div 
      className={`${classes.alert} ${classes["alert-" + level]}`}
      role="alert"
    >
      <button type="button" className={classes.closeButton} data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <span
        onClick={alert.onClick}
      >
        <strong>{alert.title}</strong>&nbsp;{alert.message}
      </span>
      
    </div>
  )
}


