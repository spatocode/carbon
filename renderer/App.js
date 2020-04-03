import React, { Component } from "react"
import { connect } from "react-redux"
import { updateLibrary, requestUpdateLibrary } from "./actions"
import Header from "./components/Header"
import Main from "./components/Main"
import Control from "./components/Control"
const { ipcRenderer } = window.require("electron")
const Store = window.require("electron-store")

class App extends Component {
    componentWillMount () {
        const store = new Store()
        const { dispatch } = this.props

        // We gat delete isUpdating if its in store
        // It's not needed in store
        if (store.has("state.media.isUpdating")) {
            store.delete("state.media.isUpdating")
        }

        const state = store.get("state")
        if (!state || state.media.library.length === 0) {
            ipcRenderer.send("should-update", true)
            dispatch(requestUpdateLibrary())
        }

        ipcRenderer.on("update-library", (event, files) => {
            dispatch(updateLibrary(files))
        })
    }

    componentWillUnmount () {
        // This is a check in case of an error which may occur
        // while updating the library and thereby leaving the
        // updating mode to true without truely updating
        const store = new Store()
        if (store.get("state.media.isUpdating")) {
            store.set("state.media.isUpdating", false)
        }
    }

    render () {
        return (
            <div className="App">
                <Header />
                <Main />
                <Control />
            </div>
        )
    }
}

export default connect()(App)
