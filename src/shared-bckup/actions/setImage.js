import firebase from 'refire/firebase'
import { SET_IMAGE } from 'constants/actionTypes'

const setImage = (imageName, path, file) => {
  let url

  const storageRef = firebase.storage().ref()
  const storagePath = storageRef.child(`images/${path}/${imageName}`)

  storagePath.put(file)
  .then((snapshot) => {
    url = snapshot.metadata.downloadURLs[0]
    console.log(path, imageName, url);
    firebase.database().ref(path).update({ [imageName]: url })
  })
  .then(() => {
    store.dispatch({ 
      type: SET_IMAGE, 
      payload: { 
        name: imageName, 
        url,
        path,
      } 
    })
  })
  .catch(err => console.log('error: ', err))
}

export default setImage
