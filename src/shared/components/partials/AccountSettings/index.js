import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { viewSettingActions } from 'shared/actions'
import { Button, Flexbox, Input, Alert, Icon, Checkbox } from 'shared/components/elements'
import { PaymentDetailsWrapper, AccountSettingsPlans } from 'shared/components/partials'
import classes from './style.scss'
import { withRouter } from 'react-router-dom'
import {
  UPDATE_USER_REQUEST,
} from 'constants/actionTypes'
import { errorActions, formActions, alertActions } from 'shared/actions'

class AccountSettings extends Component {
  constructor() {
    super()

    this.state = {
      pending: false,
    }

    this.togglePending = this.togglePending.bind(this)
    this.handleInverseCheckboxChange = this.handleInverseCheckboxChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.updateUserSettings = this.updateUserSettings.bind(this)
  }

  togglePending(value = !this.state.pending) {
    this.setState({pending: value})
  }

  // if need to reverse true to false and vice versa before sending
  handleInverseCheckboxChange (key, value) {
    this.updateUserSettings({[key]: !value})
  }

  handleCheckboxChange (key, value) {
    this.updateUserSettings({[key]: value})
  }

  // new setting should be obj with whatever keys and values to merge in
  updateUserSettings (newSettings) {
    const {user} = this.props
    const updatedSettings = Object.assign({}, user.settings || {}, newSettings)

    const cb = (result) => {
      this.setState({pending: false})
    }

    const onFailure = (err) => {
      this.setState({pending: false})
    }

    this.props.updateUser({id: user.id, settings: updatedSettings}, cb, onFailure)
  }

  render (){
    const {user} = this.props
    const {settings} = user

    return (
      <div>
        <div className={classes.formSection}>
          <Flexbox justify="space-between">
            <div className={classes.settingLabel}>Receive Email Updates:&nbsp;</div>
            <div className={classes.settingValue}>
              <div className={classes.checkbox}>
                <Checkbox onChange={this.handleInverseCheckboxChange.bind(this, "doNotReceiveEmails")} value={!settings || !settings.doNotReceiveEmails}/>
              </div>
            </div>
          </Flexbox>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    errors: state.errors,
    user: state.user,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (payload, cb, onFailure) => dispatch({type: UPDATE_USER_REQUEST, payload, cb, onFailure}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings)

