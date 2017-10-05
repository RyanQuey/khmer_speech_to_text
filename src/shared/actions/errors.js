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

export const handleErrors = (errors, templateName, templatePart, options = {})  => {
  console.log(errors);

  //as a shortcut, allow passing in an error obj with all the arguments as properties
  if (typeof errors === "object") {
    if (!Array.isArray(errors)) {
      if (!templateName && errors.templateName) {
        templateName = errors.templateName
      }
      if (!templatePart && errors.templatePart) {
        templatePart = errors.templatePart
      }
      if (options.alert === undefined && errors.alert) {
        options.alert = errors.alert
      }

      errors = [errors]
    } 
  }

  if (!templateName) {
    console.log("we are handling this, but pass in a template name");
    templateName = "Generic"
  }
  if (!templatePart) {
    console.log("we are handling this, but pass in template part");
    templateName = "generic"
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

