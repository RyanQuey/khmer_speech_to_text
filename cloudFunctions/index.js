import cloudFunctions from 'firebase-functions'

export default {
  bookSearch: () => {
    cloudFunctions.database.ref('/searches/{id}/original')
    .onWrite(event => {
      const original = event.data.val()
      console.log("calling function",original, event.params.id);  
      const u = original.to.upperCase();
    })  

    return event.data.ref.parent.child('uppercase').set(uppercase)
  }
}

