import { createStore, combineReducers, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import * as reducers from "../reducers"
const Store = window.require("electron-store")

let persistTimeout

/**
 * Logs state and action to the console
 */
const logger = store => next => action => {
    if (process.env.NODE_ENV !== "production") {
        console.groupCollapsed("dispatching", action.type)
        console.log("prev state", store.getState())
        console.log("action", action)
        next(action)
        console.log("next state", store.getState())
        console.groupEnd()
        return
    }
    return next(action)
}

function save (state) {
    return new Promise(resolve => {
        if (persistTimeout) {
            clearTimeout(persistTimeout)
        }
        persistTimeout = setTimeout(function () {
            const db = new Store()
            const localState = db.get("state")
            if (localState.media.mode !== state.media.mode) {
                db.set("state.media.mode", state.media.mode)
                console.log("Saved media view to local store!!!")
            }
            if (!localState.view || localState.view.category !== state.view.category) {
                db.set("state.view.category", state.view.category)
                console.log("Saved view to local store!!!")
            }
            if (state.media.playists && state.media.playists.length >= 0) {
                db.set("state.media.playists", state.media.playists)
                console.log("Saved playists to local store!!!")
            }
            if (state.media.favourite && state.media.favourite.length > 0) {
                db.set("state.media.favourite", state.media.favourite)
                console.log("Saved favourite to local store!!!")
            }
            if (state.media.recent && state.media.recent.length > 0) {
                db.set("state.media.recent", state.media.recent)
                console.log("Saved recent to local store!!!")
            }
            if (state.media.current &&
                state.media.current !== localState.media.current) {
                db.set("state.media.current", state.media.current)
                console.log("Saved current to local store!!!")
            }
            resolve("Saved to local store!!!")
        }, 100)
    })
}

async function persistData (state) {
    await save(state)
}

/**
 * Saves the state in the local disk
 */
const saver = store => next => action => {
    const result = next(action)
    const db = new Store()
    const state = store.getState()
    db.set("state.settings", state.settings)
    persistData(state)
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
