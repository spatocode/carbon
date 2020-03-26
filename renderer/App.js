import React, { Component } from "react"
import { connect } from "react-redux"
import { updateLibrary, requestUpdateLibrary } from "./actions"
import Header from "./components/Header"
import Main from "./components/Main"
import Control from "./components/Control"
const { ipcRenderer } = window.require("electron")

class App extends Component {
    componentWillMount () {
        const { dispatch } = this.props
        ipcRenderer.send("should-update", true)
        dispatch(requestUpdateLibrary())
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
