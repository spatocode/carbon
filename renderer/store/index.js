import { createStore, combineReducers, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import * as reducers from "../reducers"
const Store = window.require("electron-store")

/**
 * Logs state and action to the console
 */
const logger = store => next => action => {
    console.groupCollapsed("dispatching", action.type)
    console.log("prev state", store.getState())
    console.log("action", action)
    next(action)
    console.log("next state", store.getState())
    console.groupEnd()
}

/**
 * Saves the state in the local disk
 */
const saver = store => next => action => {
    const result = next(action)
    const db = new Store()
    db.set("state", store.getState())
    console.log("Saved to local store!!!")
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
            thunkMiddleware,
            saver,
            logger
        )
    )

export default storeFactory
