import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from 'shared/components/elements'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { signInRequested } from 'actions'
import {
  EMAIL,
  FACEBOOK,
  GITHUB,
  GOOGLE,
  PROVIDER,
} from 'utils/constants'
import classes from './SignIn.scss'

class SignIn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      logInModalIsOpen: false,
      menuOpen: false,
      password: '',
      validEmail: false,
      validPassword: false,
    }
  }
  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }
  openLogInModal() {
    this.setState({ logInModalIsOpen: true })
  }
  closeLogInModal() {
    this.setState({ logInModalIsOpen: false })
  }
  updateEmail(e, errors) {
    this.setState({
      email: e.target.value,
      validEmail: (errors.length === 0),
    })
  }
  updatePassword(e, errors) {
    this.setState({
      password: e.target.value,
      validPassword: (errors.length === 0),
    })
  }
  signIn(type, data) {
    this.props.signInRequested({
      type,
      data: {
        provider: data,
      },
    })
  }
  render() {
    return (
      <div>
        <Button onClick={() => this.openLogInModal()}>Log In</Button>
        <Modal
          className={`modal ${classes.loginModal}`}
          isOpen={this.state.logInModalIsOpen}
          onRequestClose={this.closeLogInModal}
          contentLabel="Example Modal"
          style={styles}
        >
          <h2>Login</h2>
          <Input
            type="email"
            onChange={(e, errors) => this.updateEmail(e, errors)}
            value={this.state.email}
            validations={['required', 'email']}
            label='Email'
            className={classes.loginInput}
          />
          <Input
            type="password"
            onChange={(e, errors) => this.updatePassword(e, errors)}
            value={this.state.password}
            validations={['required']}
            label='Password'
            className={classes.loginInput}
          />
          <Button
            onClick={() => this.signIn(EMAIL, { email: this.state.email, password: this.state.password })}
            disabled={!(this.state.validEmail && this.state.validPassword)}
          >
            Log In With Email
          </Button>

          <Button
            background="facebook"
            onClick={() => this.signIn(PROVIDER, FACEBOOK)}
          >
            Log In With Facebook
          </Button>

          <Button
            background="github"
            onClick={() => this.signIn(PROVIDER, GITHUB)}
          >
            Log In With Github
          </Button>

          <Button
            background="google"
            onClick={() => this.signIn(PROVIDER, GOOGLE)}
          >
            Log In With Google
          </Button>

          <Link
            to="/signup/create-account"
            onClick={() => this.closeLogInModal()}
          >
            Need to create an account?
          </Link>
          <Button onClick={() => this.closeLogInModal()}>close</Button>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user }
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
  },
}


export default connect(mapStateToProps, { signInRequested })(SignIn)
