/* eslint-disable no-undef */
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import storeFactory from "../renderer/store"
import App from "../renderer/App"

const store = storeFactory()

it("renders without crashing", () => {
    const div = document.createElement("div")
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        div
    )
    ReactDOM.unmountComponentAtNode(div)
})
