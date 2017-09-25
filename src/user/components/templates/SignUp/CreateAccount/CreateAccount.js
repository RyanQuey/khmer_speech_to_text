import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { userActions } from 'actions'
import { withRouter } from 'react-router-dom'
import { Button, Flexbox, Heading, Input } from 'shared/components/elements'
import { Unauthenticated } from 'user/components/yields'
import {
  FIELDS,
  NEW_EMAIL,
  FACEBOOK,
  GITHUB,
  GOOGLE,
  PROVIDER,
} from 'utils/constants'
import classes from './CreateAccount.scss'

class CreateAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      validEmail: false,
    }
  }
  updateEmail(e, errors) {
    this.setState({
      email: e.target.value,
      validEmail: (errors.length === 0),
    })
  }
  signInWithEmail() {
    userActions.signIn({
      type: EMAIL,
      data: {
        email: this.state.email,
        history: this.props.history,
      },
    })
  }
  providerSignIn(provider) {
    userActions.signIn({
      type: PROVIDER,
      data: {
        provider,
        history: this.props.history,
      },
    })
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
              name={FIELDS.EMAIL}
              onChange={(e, errors) => this.updateEmail(e, errors)}
              placeholder="your-email@gmail.com"
              type="text"
              value={this.state.email}
              validations={['required', 'email']}
            />
            <Heading level={5}>We&apos;ll send you an email to set your password.</Heading>
            <Button
              onClick={() => this.createUserWithEmail()}
              disabled={(!this.state.validEmail)}
            >
              Sign up
            </Button>
            <br />

            <Heading level={3}>Or social sign-in</Heading>
            <Button
              background="facebook"
              onClick={() => this.providerSignIn(FACEBOOK)}
            >
              Create account with Facebook
            </Button>
            <Button
              background="github"
              onClick={() => this.providerSignIn(GITHUB)}
            >
            Create account with Github
            </Button>
            <Button
              background="google"
              onClick={() => this.providerSignIn(GOOGLE)}
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
  return { user: state.user }
}

export default withRouter(connect(mapStateToProps)(CreateAccount))
