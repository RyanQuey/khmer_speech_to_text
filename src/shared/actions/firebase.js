import firebase from 'refire/firebase'
import { UPDATE_FIREBASE } from 'constants/actionTypes'
import {
  schema,
} from 'constants'


//path should be something like `users/${userId}`
const update = (path, data) => {

  const ref = firebase.database().ref(path)
  const value = inputData.value

  ref.update({ [inputData.name]: value })
  .then(() => {
    store.dispatch({ type: UPDATE_FIREBASE, payload: inputData })
  })
  .catch((err) => {
    Helpers.notifyOfAPIError(err)
  })
}

//TODO: move the association stuff into cloud functions for performance
const create = (path, data = {}) => {
  const tableName = path.split("/")[0]
  let blankEntry = schema.blankResource(tableName)

  //only allowed to persist data that matches the schema
  const filteredData = _.pick(data, Object.keys(blankEntry))
  const newEntry = Object.assign(blankEntry, data)
  
  //create the new object
  const newEntryId = database.ref(tableName).push(newEntry).key

  //check if table has associations
  //the data argument should include which resources the new entry is associated with
  const associations = schema.tables[tableName].associations
  if (associations) {
    let updates = []

    associations.forEach((association) => {
      const associationTableName = association.collection

      switch (association.type) {
        case "hasMany":
          //if the data is associated to other resources for this association upon creation: (eg, if data.posts === ["yjntgfd", '555ghbfty"])
          if (data[association.collection]) {
            let associatedRecords = data[associationTableName]
            
            // data[association.collection] can either be an object, which is how it will be persisted, or an array, but we want to work on it as an array
            if (!Array.isArray(associatedRecords)) {
              associatedRecords = Object.keys(associatedRecords)
            }

            associatedRecords.forEach((recordId) => {
              // eg, "posts/:postid/users/:userId"
              let ref = `${associationTableName}/${recordId}/${tableName}`
              updates[ref] = newEntryId
            })
          } 
          return 

        //add new entry to the other table's list
        case "oneToOne":
          // eg, "posts/:postId/useruserid/post"
          const associatedRecord = data[associationTableName]
          let ref = `${associationPath}/${associatedRecord}/${association.collection}`
          updates[ref] = true
          return 

        case "manyToMany":
          //will be the almost same as hasMany
          if (data[association.collection]) {
            let associatedRecords = data[associationTableName]
            
            // data[association.collection] can either be an object, which is how it will be persisted, or an array, but we want to work on it as an array
            if (!Array.isArray(associatedRecords)) {
              associatedRecords = Object.keys(associatedRecords)
            }

            associatedRecords.forEach((recordId) => {
              // eg, "posts/:postid/users/:userId"
              let ref = `${associationTableName}/${recordId}/${tableName}/${newEntryId}`
              updates[ref] = true
            })
          } 
          return 
          
        default: 
          return 
      } 
    })

    firebase.database().ref().update(updates)
    .catch((err) => {
      Helpers.notifyOfAPIError(err)
    })
  }

  store.dispatch({ type: UPDATE_FIREBASE, payload: {[newEntryId]: newEntry } })
}

//if finding a resource by the provided criteria does not work, will create a new resource using newResource
const findOrCreate = (tableName, criteria, newResource) => {

  const find = (() => {
    //criteria defaults as resource ID, if a string is passed in rather than an object
    if (typeof criteria === 'string') {
      return firebase.database().ref(`${tableName}`).once('value')
   
    // currently only supporting a single criterion
    } else if (typeof criteria === 'object') {
      const key = Object.keys(criteria)[0]
      const value = criteria[key]

      return firebase.database().ref(`${tableName}`).orderByChild(key).equalTo(value).limitToFirst(1).once('value')
    } else {
      console.log("criteria needs to be either a string for the resource ID or an object for the search criteria");
    }
  })

  find()
  .then((snapshot) => {
    const record = snapshot.val()
    if (!record) {
      create(tableName, newResource)
    }
  })
  .catch((err) => {
    Helpers.notifyOfAPIError(err)
  })
}

export default {
  update, 
  create,
  findOrCreate,
}
