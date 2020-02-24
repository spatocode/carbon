import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { updateLibrary } from "./actions"
import Header from "./components/Header"
import Main from "./components/Main"
import Control from "./components/Control"
const { ipcRenderer } = window.require("electron")

class App extends Component {
    componentWillMount () {
        const { dispatch } = this.props
        ipcRenderer.send("should-update", true)
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

App.propTypes = {
    shouldUpdate: PropTypes.bool,
    library: PropTypes.array
}

App.defaultProps = {
    shouldUpdate: false,
    library: []
}

const mapStateToProps = state => ({
    shouldUpdate: state.media.shouldUpdate,
    library: state.media.library
})

export default connect(mapStateToProps)(App)
