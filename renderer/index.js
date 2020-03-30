import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import App from "./App"
import storeFactory from "./store"
import "./index.css"
const Store = window.require("electron-store")

const db = new Store()
const store = storeFactory(db.get("state"))

ReactDOM.render(
    <Provider store={ store }>
        <App />
    </Provider>,
    document.getElementById("root")
)
