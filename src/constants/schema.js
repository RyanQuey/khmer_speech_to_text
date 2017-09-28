//table names should replicate the table name in firebase

//note that you have to keep track of associations in both tables
const associations = {
  manyToMany: { //aka has and belongs to many
    requiredProperties: [
      "collection", "via", "dominant", 
    ],
  },
  hasMany: {
    requiredProperties: [
      "collection", "via"
    ],
  },
  hasManyThrough: {
    requiredProperties: [
      "collection", "via", "through"
    ],
  },
  hasOneThrough: {
    requiredProperties: [
      "collection", "via", "through"
    ],
  },
  oneToOne: {
    requiredProperties: [
      "collection", "via"
    ],
  },
}

const associationTypes = {}
Object.keys(associations).forEach((association) => {
  associationTypes[association] = association
})

const recordStatuses = [
  "PENDING",
  "READY",
  "ARCHIVED",
]

// need to keep this in sync with firebase
// firebase will handle validations
const tables = {

  // columns for user 
  // NOTE: each table column has a path set dynamically by a function below
  users: {
    uid: {
      type: 'string'
    },
    avatarURL: {
      type: 'string'
    },
    bannerURL: {
      type: 'string'
    },
    display_name: {
      type: 'string'
    },
    email: {
      type: 'string',
      unique: true
    },
    providers: {
      type: 'object'
    },
    status: {
      type: 'string',
      defaultsTo: recordStatuses[0]
    },

    //schema lists associations here, but the data will be persisted in firebase with the association data inline with the other attribute
    associations: [
      {
        type: associationTypes.manyToMany, 
        collection: "userResource",  // associated tablename
      }
    ],
  }
}

//put a path property on each of the columns
const tableNames = Object.keys(tables)

tableNames.forEach((tableName) => {
  const columnNames = Object.keys(tables[tableName])

  columnNames.forEach((columnName) => {
    tables[tableName][columnName].path = `${tableName}/:id/${columnName}`
  })
})

//returns a blank object for a given table
const blankResource = (tableName) => {
  const table = schema[tableName]
  
  const resource = {}
  Object.keys(table).forEach((columnName) => {
    resource[columnName] = table[columnName].defaultsTo || ""
  })

  return resource
}

export default {
  tables,
  blankResource,
  associations
}
