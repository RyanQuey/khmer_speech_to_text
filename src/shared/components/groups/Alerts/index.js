import PropTypes from 'prop-types'
import classes from './style.scss'
import { StyleSheet, css } from 'aphrodite'
import { connect } from 'react-redux'
import { Alert } from 'shared/components/elements'
import theme from 'theme'

const Alerts = ({ alerts }) => {

  return (
    <div
      className={`${classes.alertCtn}`}
    >
      {alerts && alerts.map((alert) => {
        return <Alert key={alert.id} alert={alert} />
      })}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    alerts: _.values(state.alerts) || [],
  }
}
export default connect(mapStateToProps)(Alerts)

