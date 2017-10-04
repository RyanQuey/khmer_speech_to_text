import firebase from 'firebase'
import { userActions } from 'shared/actions'

export default ()=>{
  // check if user is already logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      userActions.findOrCreateUser(user, false)
    }
  })
}
