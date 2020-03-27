const cloudFunctions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp(cloudFunctions.config().firebase);

//NOTE: disabling this, so don't run up the charge unnecessarily
/*exports.updateUser = cloudFunctions.database.ref('/users/{id}')
  .onWrite(event => {
    const original = event.data.val()

    return admin.database().ref("/testFunction").set("cloud functions are working " + event.params.id)
  })  
*/

