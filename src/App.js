import React, { Component } from "react"
import "./App.css"
import Header from "./components/Header"
import Menu from "./components/Menu"
import View from "./components/View"
import Control from "./components/Control"

class App extends Component {
    render () {
        return (
            <div className="App">
                <Header />
                <Menu />
                <View />
                <Control />
            </div>
        )
    }
}

export default App
