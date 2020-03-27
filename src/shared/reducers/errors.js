import {
  CLEAR_ERRORS,
  HANDLE_ERRORS,
} from 'constants/actionTypes'

//separate out by template the error was made in (even if it will be handled in a different template also)

export default (state = {}, action)=>{
  let templateName, templatePart, errors, newState

  switch (action.type) {
    case HANDLE_ERRORS:
      // this is the template name, and will be the key in the error reducer. Please capitalize
      templateName = action.payload.templateName

      // this is the part of the component that raises the error. The purpose of this is to namespace the errors within the template. the value of this key should be an array. Every time the HANDLE_ERROR action gets called, this templatePart array will be completely replaced with a new errors array, containing all of the errors for this template.
      templatePart = action.payload.templatePart
      // each entry in the array for this templatePart will be an error object with the following keys:
      // {
      //   title: ,  (this will be header in the toaster. Pull these from the constants too)
      //   message: ,    (eg, "you are a bad programmer")
      //   statusCode: , (404, etc)
      //   errorType: ,  (eg, "REQUIRED_FIELDS" or "FAILED_VALIDATION")
      //   errorLevel:   (one of "ALERT", "WARNING", "DANGER", "BUG") (don't know if we want this)
      // }
      //
      // we should make constants for every errorType values, to be consistent so that we can handle them in a consistent/DRY way
      const errors = action.payload.errors || []

      newState = Object.assign({}, state)
      _.set(newState, [templateName, templatePart], errors)

      return newState

    case CLEAR_ERRORS:
      templateName = action.payload.templateName
      templatePart = action.payload.templatePart
      newState = Object.assign({}, state)

      if (!templateName) {
        newState = {}
      } else if (!templatePart) {
        _.set(newState, [templateName], {})
      } else {
        _.set(newState, [templateName, templatePart], [])
      }

      return newState

    default:
      return state
  }
}

