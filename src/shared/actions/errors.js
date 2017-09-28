import {
  CLEAR_ERRORS,
  HANDLE_ERRORS,
} from 'constants/actionTypes'
import {
  newAlert
} from 'shared/actions/alerts'

export const clearErrors = (templateName, templatePart) => {
  // do not pass in templatePart to clear the errors for all of the template
  // do not pass in templateName to clear all of the errors
  const payload = {templateName, templatePart}

  store.dispatch({
    type: CLEAR_ERRORS,
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
  if (options.alert && errors.length > 0) {
    if (options.combineAlerts) { 
      newAlert({
        title: options.combinedTitle || "Several errors occurred",
        message: options.combinedMessage || "Please check the fields below and try again",
        level: options.combinedLevel || "WARNING",
        timer: options.timer || true,
      })
    } else {
      errors.forEach((err) => {
        newAlert({
          title: err.title || "Unknown error",
          message: err.message || "Please refresh your page and try again",
          level: err.errorLevel || "WARNING",
          timer: options.timer || true,
        })
      })
    }
  }

  store.dispatch({
    type: HANDLE_ERRORS,
    payload: {
      templateName,
      templatePart,
      errors,
    }
  })
}

