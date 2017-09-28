import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { userActions } from 'shared/actions'
import { withRouter } from 'react-router-dom'
import { Button, Flexbox, Heading, Input } from 'shared/components/elements'
import { Unauthenticated } from 'user/components/yields'
import schema from 'constants/schema'
import {
  EMAIL,
  CREATE_WITH_EMAIL,
  PROVIDER,
} from 'constants/signIn'

import {
  FACEBOOK,
  GITHUB,
  GOOGLE,
} from 'constants/providers'
import errorTypes from 'constants/errors'

import classes from './CreateAccount.scss'

class CreateAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      validEmail: false,
      view: 'SIGN_UP',
      loginPending: false
    }
  }
  componentWillReceiveProps (props) {
    console.log("new props", props);
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
    return (
      <Unauthenticated>
        <Flexbox className={classes.fields} direction="column" justify="center" align="center">
          <Heading level={1} color="primary">Sign Up</Heading>
          <div className={classes.form}>
            <Heading level={3}>Email address:</Heading>
            <Input
              color="primary"
              path={schema.tables.users.email.path}
              onChange={(e, errors) => this.handleEmail(e, errors)}
              placeholder="your-email@gmail.com"
              type="text"
              value={this.state.email}
              validations={['required', 'email']}
            />
            <Heading level={5}>We&apos;ll send you an email to set your password.</Heading>
            <Button
              onClick={() => this.signInWithEmail()}
              disabled={(!this.state.validEmail || this.state.loginPending)}
            >
              Sign up
            </Button>
            <br />

            <Heading level={3}>Or social sign-in</Heading>
            <Button
              background="facebook"
              onClick={() => this.providerSignIn(FACEBOOK)}
              disabled={(this.state.loginPending)}
            >
              Create account with Facebook
            </Button>
            <Button
              background="github"
              onClick={() => this.providerSignIn(GITHUB)}
              disabled={(this.state.loginPending)}
            >
            Create account with Github
            </Button>
            <Button
              background="google"
              onClick={() => this.providerSignIn(GOOGLE)}
              disabled={(this.state.loginPending)}
            >
              Create account with Google
            </Button>
          </div>
        </Flexbox>

      </Unauthenticated>
    )
  }
}

CreateAccount.propTypes = {
  history: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { 
    user: state.shared.user,
    errors: state.shared.errors,
  }
}

export default withRouter(connect(mapStateToProps)(CreateAccount))
