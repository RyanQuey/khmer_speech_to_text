import {
  CLEAR_ERRORS,
  HANDLE_ERRORS,
} from 'constants/actionTypes'

export const clearErrors = (templateName, templatePart) => {
  // do not pass in templatePart to clear the errors for all of the template
  // do not pass in templateName to clear all of the errors
  const payload = {templateName, templatePart}

  store.dispatch({
    type: actionTypes.CLEAR_ERRORS,
    payload
  })
}

export const handleErrors = (templateName, templatePart, errors, options = {})  => {

  if (!templateName) {
    console.log("we are handling this for you, but please pass in a template name");
    templateName = "Generic"
  }
  if (!templatePart) {
    console.log("we are handling this for you, but please pass in a template part");
    templateName = "generic"
  }
  if (!Array.isArray(errors)) {
    errors = [errors]
  }

  //by default, we will just override whatever errors existed previously for this part of the template
  //however, can change this using options
  if (options.method === "addToExisting") {
    errors = store.getState().errors[templateName].concat(errors)
  }

  store.dispatch({
    type: actionTypes.HANDLE_ERRORS,
    payload: {
      templateName,
      templatePart,
      errors,
    }
  })
}

