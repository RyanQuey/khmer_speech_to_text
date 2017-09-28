import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Flexbox, Alert } from 'shared/components/elements'
import classes from './Unauthenticated.scss'

class Unauthenticated extends Component {
  render() {
    const { children } = this.props
    const alerts = _.values(this.props.alerts)

    return (
      <Flexbox className={classes.mainContainer} justify="center" align="center" flexWrap="wrap">
        {alerts && alerts.map((alert) => {
          return <Alert alert={alert} />
        })}
        <main>
          <Flexbox className={classes.content} justify="center" flexWrap="wrap">
            {children}
          </Flexbox>
        </main>
      </Flexbox>
    )
  }
}

Unauthenticated.propTypes = {
  children: PropTypes.node.isRequired,
}
const mapStateToProps = (state) => {
  return { 
    alerts: state.shared.alerts,
  }
}

export default connect(mapStateToProps)(Unauthenticated)
