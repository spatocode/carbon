import React, { Component } from "react"
import Header from "./components/Header"
import Main from "./components/Main"
import Control from "./components/Control"

class App extends Component {
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

export default App
