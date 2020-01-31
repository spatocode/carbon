import React from "react"
import $ from 'jquery'
import { Menu, View, Control } from "./components/container"

class App extends React.Component {
    render () {
        return (
            <div style={styles.app}>
                <Menu />
                <View />
                <Control />
            </div>
        )
    }
}

const styles = {
    app: {
        display: "flex"
    }
}

export default App
