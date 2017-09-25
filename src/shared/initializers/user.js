import firebase from 'firebase'

export default ()=>{
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userAuthData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      }
  
      store.dispatch(userFetchRequested(userAuthData))
  
    } else {
      //appStore.dispatch(isPreloadingStore(false))
    }
  })
}
