import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { errorActions, alertActions, formActions } from 'shared/actions'
import { Button, Flexbox, Input, Checkbox } from 'shared/components/elements'
import { SIGN_IN_REQUEST, UPDATE_USER_REQUEST, RESET_PASSWORD_REQUEST } from 'constants/actionTypes'
import info from 'constants/info'
const { supportEmail, instructionVideoEnglishUrl, instructionVideoKhmerUrl } = info

import classes from './style.scss'

class UserCredentials extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: "",
      validEmail: false,
      view: props.initialView || 'LOGIN',
      acceptedTerms: false,
    }

    this.submit = this.submit.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.toggleTos = this.toggleTos.bind(this)
  }
  componentDidMount() {
    // check on initialization, since often credential managers will just have it set already
    formActions.setParams("UserCredentials", "credentials", {password: this.props.password})
    formActions.setParams("UserCredentials", "credentials", {email: this.props.email})
    this.setState({
      validEmail: (!this.props.loginErrors || this.props.loginErrors.length === 0),
    })
  }

  componentWillReceiveProps(props) {
    //(if logging in, and there's an error that's new, stop pending or else it might get stuck indeffinitely spinning)
    if (props.loginErrors && props.loginErrors !== this.props.loginErrors) {
      this.props.togglePending && this.props.togglePending(false);
    }
  }

  handlePassword(value, e, errors) {
    formActions.setParams("UserCredentials", "credentials", {password: value})
  }
  handleEmail(value, e, errors) {
    // check email
    formActions.setParams("UserCredentials", "credentials", {email: value})
    this.setState({
      validEmail: (!errors || errors.length === 0),
    })
  }

  toggleTos(value) {
    this.setState({acceptedTerms: value})
  }

  submit(e) {
    e.preventDefault()
    this.props.togglePending(true);
    console.log("closing alerts")
    alertActions.closeAlerts()

    let password = this.props.password
    let email = this.props.email
    let token = this.props.viewSettings.modalToken
    let cb

    if (this.props.view === "SET_CREDENTIALS") {
      let params = {}
      cb = () => {
        alertActions.newAlert({
          title: "Credentials successfully updated",
          level: "SUCCESS",
        })
      }
      if (password) {params.password = password}
      if (email) {params.email = email}

      this.props.updateUser(params, cb)

    } else if (this.props.view === "RESETTING_PASSWORD") {
      cb = () => {
        this.props.togglePending(false)
        this.setState({
          //change view to login
        })
      }
      this.props.resetPasswordRequest(email, cb)

    } else {

      this.props.submit()
    }
  }

  render() {
    const view = this.props.view
    let passwordValidations = ['required']
    if (view === "SIGN_UP") {passwordValidations.push("newPassword")}
    //TODO: set the title using props into the modal container
    return (
      <form onSubmit={this.submit}>
        {!this.props.passwordOnly && (
          <Input
            color="primary"
            onChange={this.handleEmail}
            placeholder="your-email@gmail.com"
            type="email"
            value={this.props.email}
            validations={['required', 'email']}
            handleErrors={errors => errorActions.handleErrors(errors, "Login", "credentials", {alert: false})}
          />
        )}

        {view !== "RESETTING_PASSWORD" &&
          <Input
            color="primary"
            onChange={this.handlePassword}
            placeholder="password"
            type="password"
            value={this.props.password}
            validations={passwordValidations}
            handleErrors={errors => errorActions.handleErrors(errors, "Login", "credentials", {alert: false})}
          />
        }

        {view === "SIGN_UP" &&
          <div>
            <Checkbox
              value={this.state.acceptedTerms}
              onChange={this.toggleTos}
              label="I have read and agree to the"
            />&nbsp;
            <a href="/legal/terms-of-service.pdf" target="_blank">Terms of Service</a>
            <div>
              Please make sure to request access for this email from {supportEmail}, if you have not already.
            </div>

          </div>
        }
        <Button
          disabled={(
            (!this.props.passwordOnly && !this.state.validEmail) ||
            (view !== "RESETTING_PASSWORD" && this.props.loginErrors && this.props.loginErrors.length) ||
            (view === "SIGN_UP" && !this.state.acceptedTerms)
          )}
          type="submit"
          title={(view === "SIGN_UP" && !this.state.acceptedTerms) ? "Please read and accept the terms of service before continuing" : ""}
          pending={this.props.pending}
        >
          {this.props.buttonText}
        </Button>
      </form>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (userData, cb) => store.dispatch({type: UPDATE_USER_REQUEST, payload: userData, cb}),
    resetPasswordRequest: (email, cb) => store.dispatch({type: RESET_PASSWORD_REQUEST, payload: email, cb}),

  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginErrors: Helpers.safeDataPath(state, "errors.Login.credentials", false),
    viewSettings: state.viewSettings,
    password: Helpers.safeDataPath(state, "forms.UserCredentials.credentials.params.password", ""),
    email: Helpers.safeDataPath(state, "forms.UserCredentials.credentials.params.email", ""),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCredentials)
