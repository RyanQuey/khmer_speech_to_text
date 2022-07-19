import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { alertActions, userActions, errorActions } from 'shared/actions'
import { Button, Flexbox, Input, Checkbox } from 'shared/components/elements'
import {
  SIGN_IN_REQUEST,
} from 'constants/actionTypes'
import { withTranslation } from 'react-i18next';
import { 
  //SocialLogin, 
  UserCredentials 
} from 'shared/components/partials'
import { withRouter } from 'react-router-dom'

import errorTypes from 'constants/errors'

import classes from './style.scss'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: Helpers.safeDataPath(props, "viewSettings.Login.initialView", 'LOGIN'),
      pending: false,
    }

    this.toggleView = this.toggleView.bind(this)
    this.togglePending = this.togglePending.bind(this)
    this.toggleResetPassword = this.toggleResetPassword.bind(this)
    this.submitCredentials = this.submitCredentials.bind(this)
    this.handleSuccesfulResetPassword = this.handleSuccesfulResetPassword.bind(this)
  }

  componentWillReceiveProps (props) {
    const user = props.user
    const errors = Helpers.safeDataPath(props, 'errors.Login.onSubmit', false)

    if (errors.length > 0 || user && Object.keys(user).length >0) {
      this.setState({ pending: false });
    }

    if (user && Object.keys(user).length > 0) {
      // closes modal etc, if in modal
      this.props.onSuccess();
    }

//TODO just use a callback in the action
    errors && errors.forEach((err) => {
      if (err.type === errorTypes.RECORD_ALREADY_EXISTS.type) {
        let toReturn = {
          title: props.t("Account already exists for this email"),
          message: props.t("Please try logging in instead")
        }
        errorActions(toReturn)

        this.setState({ view: 'LOGIN' });
      }
    })
  }
  togglePending(value = !this.state.pending) {
    this.setState({pending: value})
  }

  handleSuccesfulResetPassword(e) {
    e && e.preventDefault()

    this.togglePending()
    // change back to login view
    this.toggleResetPassword()

    // does some stuff, including close modal if in modal
    this.props.onSuccess()
  }

  toggleResetPassword(e) {
    e && e.preventDefault()

    if (this.state.view === "LOGIN") {
      // July 2022 update: Gave this a college try, but email wasn't sending, and also if it sends
      // then it just sends the user back to us so they can reset the password anyways, so yeah. Not
      // doing that! 
      //this.setState({view: "RESETTING_PASSWORD"})
      alertActions.newAlert({
        title: "Please contact admin at voice@sbbic.org for help resetting your password",
        level: "WARNING",
      })
      // close modal
      this.props.onSuccess()

    } else {
      this.setState({view: "LOGIN"})
    }
  }
  toggleView(e) {
    e.preventDefault()

    if (this.state.view === "LOGIN") {
      this.setState({view: "SIGN_UP"})
    } else {
      this.setState({view: "LOGIN"})
    }
  }

  setOnboardingStage(value) {
    this.setState({onboardingStage: value}) //CHOOSE_PRICING_PLAN, ADD_CARD, or ADD_CREDENTIALS
  }

  submitCredentials () {
    let signInType
    if (this.state.view === "LOGIN"){
      signInType = 'SIGN_IN_WITH_EMAIL'

    } else if (this.state.view === 'SIGN_UP') {
      signInType = 'SIGN_UP_WITH_EMAIL'
    }

      //not a login token, but any other token that needs a logged in user for it to operate
    const token = this.props.viewSettings.modalToken
    const onFailure = () => {
      this.togglePending(false)
    }
    const cb = (allData) => {
    }

    const credentials = {password: this.props.password, email: this.props.email}
    this.props.signInRequest(signInType, credentials, token, onFailure, cb)
  }

  render() {
    const { t } = this.props
    const view = this.state.view
    let generalText
    switch (view) {
      case "SIGN_UP":
        generalText = t("Signup")
        break

      case "LOGIN":
        generalText = t("Login")
        break

      case "RESETTING_PASSWORD":
        generalText = t("Reset Password")
        break
    }

    //const socialText = view === "LOGIN" ? "Login" : "Create account"
    const credentialsOnly = true //Helpers.safeDataPath(this.props, "viewSettings.modalOptions.credentialsOnly", false);
    const resettingPassword = view === "RESETTING_PASSWORD"
    //TODO: set the title using props into the modal container

    return (
      <Flexbox className={classes.fields} direction="column" justify="center" align="center">
        <h1 color="primary">{generalText}</h1>
        <UserCredentials
          view={view}
          buttonText={generalText}
          pending={this.state.pending}
          token={this.props.viewSettings.modalToken}
          handleSuccesfulResetPassword={this.handleSuccesfulResetPassword} 
          togglePending={this.togglePending}
          submit={this.submitCredentials}
        />
        {view === "LOGIN"  &&
          <a href="#" onClick={this.toggleResetPassword}>{this.state.resettingPassword ? t("Login or signup") : t("Forget your password?")}</a>
        }

        <br/>
        {!credentialsOnly && !resettingPassword && view === "LOGIN" && <div>
          <h3>{socialText} {t("through one of your social networks:")}
          </h3>
          <SocialLogin
            pending={this.state.pending}
            togglePending={this.togglePending}
          />
        </div>}
        <a
          onClick={this.toggleView}
          href="#"
        >
          {view === "LOGIN" ? (
            t("Don't have an account? Click here to sign up")
          ) : (
            t("Already have an account? Click here to login")
          )}
        </a>
      </Flexbox>
    )
  }
}

Login.propTypes = {
  history: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    errors: state.errors,
    viewSettings: state.viewSettings || {},
    password: Helpers.safeDataPath(state, "forms.UserCredentials.credentials.params.password", ""),
    email: Helpers.safeDataPath(state, "forms.UserCredentials.credentials.params.email", ""),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signInRequest: (signInType, credentials, token, onFailure, cb) => store.dispatch({
      type: SIGN_IN_REQUEST,
      payload: {signInType, credentials, token},
      onFailure,
      cb,
    }),
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Login)))
