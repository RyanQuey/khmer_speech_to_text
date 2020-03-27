import { take } from 'redux-saga/effects'
import {
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_REQUEST,
  UPDATE_TOKEN_SUCCESS,
  HANDLE_QUERY,
  FETCH_PLAN_SUCCESS,
  SET_CURRENT_MODAL,
} from 'constants/actionTypes'
import { errorActions, alertActions, viewSettingActions } from 'shared/actions'
import { setupSession } from 'lib/socket'

// handles query strings in url
const handleQuery = (rawQuery, handleQueryCb) => {
console.log("running");
  //pulls a global variable from the HTML file, what was dynamically rendered via the front end server
  //TODO: if I ever set other variables, change the way that these variables get passed around , so I don't have to parse more than once

  if (rawQuery) {
    let cb, user, doneOptions = {}
    const variables = rawQuery.replace(/^\?/, "").split('&')
    for (let i = 0; i < variables.length; i++) {
      try {
        const pair = variables[i].split('=')
        const key = decodeURIComponent(pair[0])
        const value = decodeURIComponent(pair[1])
        switch (key) {
          case "user":
            const userData = JSON.parse(value)

            if (
              !userData || !(typeof userData === "object") || Object.keys(userData).length === 0
            ) {
              Helpers.notifyOfAPIError({
                title: "Error logging in using provider:",
                message: "Please try again",
                templateName: "Home",
                templatePart: "noUser",
                alert: true
              })
              return
            }

            user = userData.user ? userData.user : userData
            const userPlans = userData.plans ? userData.plans : null//not using
            cb = () => {
              //let cu = Cookie.get('sessionUser');
              alertActions.newAlert({
                title: "Success!",
                //TODO would send this even on signing in...eventually, be able to distinguish signing in and adding permissions for the message.
                //message: "Permissions granted for this platform",
                level: "SUCCESS",
              })
            }
            validUserReceived(user, cb)
            break;

          case "token":
            const token = value

            //retrieve the token data and handle
            axios.post(`/api/tokens/${token}/useToken`)
            .then((result) => {
              let resultCode = Helpers.safeDataPath(result, "data.code", false)
              let tokenType = Helpers.safeDataPath(result, "data.tokenType", false)
              console.log(result && result.data);
              //token might have worked; but user needs to login
              if (resultCode === "promptLogin") {
                store.dispatch({type: SET_CURRENT_MODAL, payload: "UserLoginModal", token: result.data.token, options: {credentialsOnly: true}})

              } else if (tokenType === "resetPassword") {
                //successfully reset password
                user = result.data.user
                doneOptions.sendHome = true
                validUserReceived(user, false)
              } else if (tokenType === "confirmation") {
                //tell api email is confirmed

                doneOptions.sendHome = true
                alertActions.newAlert({
                  title: "Your email has been confirmed!",
                  level: "SUCCESS",
                })

              } else {

                throw {code: 400}
              }

              handleQueryCb && handleQueryCb(doneOptions)

            })
            .catch((err) => {
              console.error(err);
              //need to test this. would be if user is not logged in while trying to use token
              if (err.code === 400) {
                console.log("for better");
                //prompt login
              }

              alertActions.newAlert({
                title: "Invalid Token:",
                message: "Please try again. If problem persists, please contact support",
                level: "DANGER",
                options: {timer: false},
              })
            })

            break;

          //front end server's way of posting an alert
          case "alert":
            const alertType = value
            //they rejected
            if (alertType === "canceledAuthorization") {
              alertActions.newAlert({
                title: "Warning:",
                message: "Permissions not granted",
                level: "DANGER",
              })

            } else if (alertType === "failedAuthorization") {
              alertActions.newAlert({
                title: "Unknown Error:",
                message: "Failed to login. Please try again. If this continues to occur, please contact Growth Ramp",
                level: "DANGER",
                options: {timer: false}
              })

            } else if (alertType === "failedOauthSignup") {
              alertActions.newAlert({
                title: "Failed to Register Account:",
                message: "Signup using social networks is currently not allowed. Please signup using email and password.",
                level: "DANGER",
                options: {timer: false}
              })
            }

            break;
          case "signup":
            //handling in component; want this set async and not doing that here right now, and easier to do in component and pass through just the way login is built

            let signup = value === "true"
            viewSettingActions.setViewMode("Login", {initialView: signup ? "SIGN_UP" : "LOGIN"})
            break;
        }


      } catch (err) {
        //TODO make an alert
        //I really just want to make provider stuff a popup...
        errorActions.handleErrors({
          title: "Error logging in using provider:",
          message: "Perhaps you tried linking an account that wasn't yours? Please try again",
          templateName: "Home",
          templatePart: "noUser",
          errorObject: err,
        }, null, null, {
          timer: false
        })
      }
    }
  }
}

//if data in query indicates a valid user is received
//will get rest of user's data etc
function validUserReceived (user, cb) {
  //setup the session
  setupSession(user)
  store.dispatch({type: FETCH_CURRENT_USER_REQUEST, payload: user, cb})
}

export default handleQuery
