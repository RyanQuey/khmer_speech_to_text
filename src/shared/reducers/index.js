import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import rootSaga from 'shared/sagas'

import alertReducer from './alerts'
import errorReducer from './errors'
import formsReducer from './forms'
import userReducer from './user'
import viewSettingsReducer from './viewSettings'

const rootReducer = combineReducers({
  alerts: alertReducer,
  errors: errorReducer,
  forms: formsReducer,
  // the current user
  user: userReducer,
  viewSettings: viewSettingsReducer,
})

const sagaMiddleware = createSagaMiddleware()

window.store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  )
)

sagaMiddleware.run(rootSaga)

export default window.store
