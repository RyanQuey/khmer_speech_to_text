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

export const handleErrors = (errors = [], templateName, templatePart, options = {})  => {
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

      //axios often has response property, but you wouldn't see it if don't ask for it
      if (errors.errorObject && errors.errorObject.response) {
        console.error(errors.errorObject.response)
        //test the invalid attributes
        //TODO handle for multiple errors, if multiple are passed in
        let invalidAttributes = Helpers.safeDataPath(errors.errorObject.response, "data.invalidAttributes", false)
        if (invalidAttributes && options.useInvalidAttributeMessage) {
          let formValidationMessage = [] //will optionally use this to override message
          let iaKeys = Object.keys(invalidAttributes)
          for (let i = 0; i < iaKeys.length; i++) {
            let attribute = iaKeys[i]
            let brokenRules = invalidAttributes[attribute]
            for (let invalidAttributeData of brokenRules) {
              if (invalidAttributeData.rule === "unique") {
                formValidationMessage.push(`${attribute} ${invalidAttributeData.value} already exists`)
              } //TODO apply custom stuff depending on broken rules; other rules too
            }
          }

          errors.message = formValidationMessage.join("; ").capitalize()
        }
      } else {
        //not from axios
        console.error(errors.errorObject)
      }
      errors = [errors]
    }
  } else {
    console.log("ERROR", errors);
  }

  if (!templateName) {
    //console.log("we are handling this, but pass in a template name");
    templateName = "Generic"
  }
  if (!templatePart) {
    //console.log("we are handling this, but pass in template part");
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
        options: options.alertOptions || {},
      })
    } else {
      errors.forEach((err) => {
        newAlert({
          title: err.title || "Unknown error",
          message: err.message || "Please refresh your page and try again",
          level: err.level || "WARNING",
          timer: options.timer || true,
          options: options.alertOptions || {},
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

