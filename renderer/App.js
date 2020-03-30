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
        const state = store.get("state")
        console.log(state)
        if (!state || state.media.library.length === 0) {
            ipcRenderer.send("should-update", true)
            dispatch(requestUpdateLibrary())
        }

        ipcRenderer.on("update-library", (event, files) => {
            dispatch(updateLibrary(files))
        })
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
