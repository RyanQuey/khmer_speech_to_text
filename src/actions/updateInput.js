import firebase from 'refire/firebase'
import { throttle } from 'underscore'
import { INPUT_UPDATE } from 'actions/types'

const inputUpdate = inputData => {

  const userId = store.getState().currentUser.id
  const path = `users/${userId}`
  const ref = firebase.database().ref(path)
  const value = inputData.value

  ref.update({ [inputData.name]: value })
  .then(() => {
    store.dispatch({ type: INPUT_UPDATE, payload: inputData })
  })
  .catch((err) => {
    console.log("error updating input field");
    console.log(err);
  })
}

export default inputUpdate
