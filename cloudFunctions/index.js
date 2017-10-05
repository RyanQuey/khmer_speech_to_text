const cloudFunctions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp(cloudFunctions.config().firebase);

exports.bookSearch = cloudFunctions.database.ref('/users/{id}')
  .onWrite(event => {
    const original = event.data.val()
    console.log("calling function",original, event.params.id);  

    return event.data.ref.update({testFunction: "ab"})
  })  


