import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { userActions } from 'shared/actions'
import { Button, Flexbox, Input } from 'shared/components/elements'
import schema from 'constants/schema'
import {
  EMAIL,
  CREATE_WITH_EMAIL,
  PROVIDER,
} from 'constants/login'

import {
  FACEBOOK,
  GOOGLE,
} from 'constants/providers'
import errorTypes from 'constants/errors'

import classes from './style.scss'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      validEmail: false,
      view: props.initialView || 'LOGIN',
      loginPending: false
    }
    
    this.toggleView = this.toggleView.bind(this)
  }
  componentWillReceiveProps (props) {
    const user = props.user
    const errors = Helpers.safeDataPath(props, 'errors.Login.onSubmit', false)

    if (errors.length > 0 || user && Object.keys(user).length >0) {
      this.setState({ signingIn: false });
    }

    if (user && Object.keys(user).length > 0) {
      this.props.onSuccess();
    }

    errors && errors.forEach((err) => {
      if (err.type === errorTypes.RECORD_ALREADY_EXISTS.type) {
        
      }
    })
  }

  toggleView(e) {
    e.preventDefault()

    if (this.state.view === "SIGN_UP") {
      this.setState({view: "LOGIN"})
    } else {
      this.setState({view: "SIGN_UP"})
    }
  }

  handleEmail(e, errors) {
    this.setState({
      email: e.target.value,
      validEmail: (errors.length === 0),
    })
  }
  signInWithEmail() {
    let type
    this.setState({ loginPending: true });
    if (this.state.view === 'SIGN_UP') {
      type = CREATE_WITH_EMAIL
    } else {
      type = EMAIL
    }
    userActions.signIn(
      type,
      {
        email: this.state.email,
        history: this.props.history,
      },
    )
  }
  providerSignIn(provider) {
    this.setState({ loginPending: true });
    userActions.signIn(
      PROVIDER,
      {
        provider,
        history: this.props.history,
      },
    )
  }
  render() {
    const view = this.state.view
    const generalText = view === "LOGIN" ? "Login" : "Sign Up"
    const socialText = view === "LOGIN" ? "Login" : "Create account"
    //TODO: set the title using props into the modal container

    return (
      <Flexbox className={classes.fields} direction="column" justify="center" align="center">
        <h1 color="primary">{generalText}</h1>
        <div className={classes.form}>
          <h3>Email address{view === "LOGIN" && " and password" }:</h3>
          <Input
            color="primary"
            onChange={(e, errors) => this.handleEmail(e, errors)}
            placeholder="your-email@gmail.com"
            type="email"
            value={this.state.email}
            validations={['required', 'email']}
          />
          {view === "LOGIN" ? (
            <Input
              color="primary"
              onChange={(e, errors) => this.handlePassword(e, errors)}
              placeholder="password"
              type="password"
              value={this.state.password}
              validations={['required']}
            />
          ) : (
            <h5>We&apos;ll send you an email to set your password.</h5>
          )}          
          <Button
            onClick={() => this.signInWithEmail()}
            disabled={(!this.state.validEmail || this.state.loginPending)}
          >
            {generalText}
          </Button>
          <br />
          <h3>Or {socialText.toLowerCase()} through Google or Facebook:</h3>
          <Button
            background="facebook"
            onClick={() => this.providerSignIn(FACEBOOK)}
            disabled={(this.state.loginPending)}
          >
            {socialText}&nbsp;with Facebook
          </Button>
          <Button
            background="google"
            onClick={() => this.providerSignIn(GOOGLE)}
            disabled={(this.state.loginPending)}
          >
            {socialText}&nbsp;with Google
          </Button>

          <br/>
          <a
            onClick={this.toggleView}
            href="#"
          >
            {view === "LOGIN" ? (
              "Don't have an account? Click here to sign up"
            ) : (
              "Already have an account? Click here to login"
            )}
          </a>
        </div>
      </Flexbox>
    )
  }
}

Login.propTypes = {
  history: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { 
    user: state.shared.user,
    errors: state.shared.errors,
  }
}

export default connect(mapStateToProps)(Login)
