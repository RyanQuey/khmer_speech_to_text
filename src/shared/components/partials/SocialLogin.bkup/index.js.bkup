import { Component } from 'react';
import querystring from 'querystring'
import { connect } from 'react-redux'
import {
  SIGN_IN_REQUEST,
  SIGN_OUT_REQUEST,
  LINK_ACCOUNT_REQUEST,
} from 'constants/actionTypes'
import { PROVIDERS, PROVIDER_IDS_MAP } from 'constants/providers'
import { Button, Icon } from 'shared/components/elements'
import classes from './style.scss'

class SocialLogin extends Component {
  constructor() {
    super()
    this.state = {
      chosenProvider: "",
    }
  }
  //need to enable with e-mail
  providerLogin(providerName, e) {
    //NOTE: beware of setting onClick on the button, if you do, causes the whole social login to break.

    //TODO: eventually have pop-up logic etc. here
    //don't refresh page when button is disabled
    this.props.togglePending(true)
    this.setState({chosenProvider: providerName})
    this.props.disabled && e.preventDefault()

    //works because this runs before the link is followed
    //so I can retrieve it upon return
    if (providerName.toUpperCase() === "LINKEDIN") {
      const scopes = ['r_emailaddress', 'r_basicprofile'].concat(this.props.scopes || [])
      Cookie.set("requestedScopes", scopes)
    }
  }

  render() {
    const user = this.props.user;
    const preposition = user ? "to" : "with";
    const providers = this.props.providers || PROVIDERS
    const scopeQuery = this.props.scopes ? `?${querystring.stringify({scope: this.props.scopes})}` : "" //take this.props.scopes and convert the object into a query string that will be interpreted by the front end server
    const disabled = this.props.pending || this.props.disabled
    //TODO: this button should really make a post...especially when wrapped within a form

    return (
      <div>
        {Object.keys(providers).map((key) => {
          const providerName = providers[key].name

            return (
              <a
                href={`/login/${providerName}${scopeQuery}`}
                onClick={this.providerLogin.bind(this, providerName)}
                key={providerName}
              >
                <Button
                  background={providerName.toLowerCase()}
                  disabled={disabled}
                  style={Object.keys(providers).length > 1 ? "inverted" : "primary"}
                >
                  {this.props.pending && providerName === this.state.chosenProvider ? (
                    <Icon name="spinner" className="fa-spin" color={Object.keys(providers).length > 1 ? "primary" : "white"} />
                  ) : (
                    <span>
                      {<Icon name={providerName.toLowerCase()}  className={classes.icon}/>}
                      {`Login ${preposition} ${providerName}`}
                    </span>
                  )}
                </Button>
              </a>
            )
        })}
      </div>
    );
  }
}

// getting redux state passed into the *state* of ConnectedLogin, to be passed into the *props* of index
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

// can be passed in as { signInRequest } into connect as a shortcut, but learning the long way for now until I can get used to it, and know how to modify the dispatches for later on
const mapDispatchToProps = (dispatch) => {
  return {
    signInRequest: (payload) => dispatch({type: SIGN_IN_REQUEST, payload}),
    linkAccountRequest: (payload) => dispatch({type: LINK_ACCOUNT_REQUEST, payload}),
    signOutRequest: (payload) => {dispatch({type: SIGN_OUT_REQUEST, payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialLogin)
