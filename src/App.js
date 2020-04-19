import { Component } from 'react';
import logo from 'images/logo.png';
import User from 'user/components'
import { connect } from 'react-redux'
import classes from 'App.scss';
import {
  withRouter,
} from 'react-router-dom'
import handleQuery from 'utils/handleQuery'
import { 
  FETCH_CURRENT_USER_REQUEST,
} from 'constants/actionTypes'
import { errorActions, userActions } from 'shared/actions'

class App extends Component {
  // make sure runs first, or login/signup currently will just do login, will never start at signup due to race conditions
  componentDidMount() {
    //extract the query string
    const query = this.props.location.search
    //right now, this is only returning user and provider
    if (query) {
      const cb = (options) => {
        if (options.sendHome) {
          this.props.history.push("/")
        } else {
          //strips off the query string
          this.props.history.push(this.props.location.pathname)
        }
      }

      handleQuery(query, cb);
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // when hit api, make sure to send bearer token
        // TODO make a helper function, will need to call whenever the token expires in order to hit the cloud functions
        // will have to refresh this every hour or it expires, so call this before hitting cloud functions
        userActions.setBearerToken()
    
        //need to retrieve user data from firebase, to put into redux
        //mostly only gets ran when reloading the page after already logged in
        if (!this.props.user) {
          const userData = Helpers.extractUserData(user)
          this.props.fetchCurrentUserRequest(userData, {findOrCreate: true})
        }
      
    
      } else {
        // stop preloading, because no user in firebase to preload
        //store.dispatch(isPreloadingStore(false))

      }
    })
    
  }
  render() {
    return (
      <div className={`${classes.App} desktop`}>
        {this.props.preloadingStore ? ( //currently , not implemented...I might not ever
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            <div>loading...</div>
          </div>
        ) : (
          <User />
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    preloadingStore: state.preloadingStore,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCurrentUserRequest: (payload, options) => dispatch({ type: FETCH_CURRENT_USER_REQUEST, payload, options }),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
