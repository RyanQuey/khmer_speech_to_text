import {
  SET_PARAMS,
  SET_OPTIONS,
  CLEAR_PARAMS,
  FORM_PERSISTED,
} from 'constants/actionTypes'

//separate out by template the error was made in (even if it will be handled in a different template also)

export default (state = {}, action) => {
  const pld = action.payload
  let newState, data, currentOptions

  switch (action.type) {
    case SET_PARAMS:
      currentOptions = Helpers.safeDataPath(state, `${pld.component}.${pld.form}.options`, {})
      data = {
        //merge the params in payload onto current params for this form
        dirty: pld.dirty,
        options: currentOptions,
      }
      newState = Object.assign({}, state)

      if (pld.override) {
//console.log("now override");
        //override whatever is there
        data.params = Object.assign({}, pld.params)

      } else {
        //merging into current state
        let oldParams = Helpers.safeDataPath(state, `${pld.component}.${pld.form}.params`, {})
        data.params = Object.assign({}, oldParams, pld.params)
      }
//console.log(data);
      _.set(newState, `${pld.component}.${pld.form}`, data)
//console.log(newState);
      return newState

    case SET_OPTIONS:
      newState = Object.assign({}, state)
      let oldOptions = Helpers.safeDataPath(state, `${pld.component}.${pld.form}.options`, {})
      _.set(newState, `${pld.component}.${pld.form}.options`,
        //merge the options in payload onto current options for this form
        Object.assign({}, oldOptions, pld.options),
      )

      return newState

    case CLEAR_PARAMS:
      currentOptions = Helpers.safeDataPath(state, `${pld.component}.${pld.form}.options`, {})
      data = {
        //merge the params in payload onto current params for this form
        dirty: false,
        options: currentOptions,
        params: {}
      }

      newState = Object.assign({}, state)
      _.set(newState, `${pld.component}.${pld.form}`, data)

      return newState

    case FORM_PERSISTED:
      newState = Object.assign({}, state)
      _.set(newState, `${pld.component}.${pld.form}.dirty`, false)

      return newState
    default:
      return state
  }
}

