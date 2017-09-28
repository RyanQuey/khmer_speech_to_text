import firebase from 'firebase'
import { userActions } from 'shared/actions'

export default ()=>{
  // check if user is already logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userAuthData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        id: user.uid,
      }
  
      userActions.findOrCreateUser(userAuthData, false)
    }
  })
}
