import React from "react"
import Menu from "./Menu"
import View from "./View"
import ModalBox from "./ModalBox"
import "./stylesheets/Main.scss"

const Main = () => {
    return (
        <div className="main">
            <Menu />
            <View />
            <ModalBox />
        </div>
    )
}

export default Main
