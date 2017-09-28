import firebase from 'firebase'
import { userActions } from 'shared/actions'

export default ()=>{
  //
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userAuthData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        id: user.uid,
      }
  
      store.dispatch(userActions.findOrCreateUser(userAuthData, false))
  
    } else {
      //appStore.dispatch(isPreloadingStore(false))
    }
  })
}
