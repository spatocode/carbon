import { createStore, combineReducers, applyMiddleware } from "redux"
import * as reducers from "../reducers"

/**
 * Logs state and action to the console
 */
const logger = store => next => action => {
  let result
  console.groupCollapsed('dispatching', action.type)
  console.log('prev state', store.getState())
  console.log('action', action)
  result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
}

/**
 * Saves the state in the localStorage
 */
const saver = store => next => action => {
  let result = next(action)
  localStorage["redux-store"] = JSON.stringify(store.getState())
  return result
}

/**
 * Returns the application state tree
 * @param {Object} preloadedState 
 */
const storeFactory = (preloadedState) =>
  createStore(
    combineReducers(reducers),
    preloadedState,
    applyMiddleware(
      saver,
      logger
    )
  )

export default storeFactory
