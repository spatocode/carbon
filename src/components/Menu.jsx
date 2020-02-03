import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { selectView, nightMode } from "../actions"
import { version } from "../../package.json"
import "./stylesheets/Menu.scss"

const Menu = ({ nightMode=false, handleView=f=>f }) => {
    const handleNightmode = () => {
        handleView(!nightMode)
    }
    return (
        <div className="Menu">
            <div className="title">
                <img src=""/>
                {version}
            </div>
            <div className="menu-list" onClick={handleView}>
                <span></span>
                <span>Now Playing</span>
            </div>
            <div className="menu-list" onClick={handleView}>
                <span><img src=""/></span>
                <span>Music</span>
            </div>
            <div className="menu-list" onClick={handleView}>
                <span></span>
                <span>Video</span>
            </div>
            <div className="menu-list" onClick={handleView}>
                <span></span>
                <span>Playist</span>
            </div>
            <div className="menu-list" onClick={handleView}>
                <span></span>
                <span>Favourite</span>
            </div>
            <div className="menu-list" onClick={handleView}>
                <span></span>
                <span>Downloads</span>
            </div>
            <div className="menu-list" onClick={handleView}>
                <span></span>
                <span>Settings</span>
            </div>
            <div className="menu-list" onClick={handleNightmode}>
                <span>Night mode</span>
                <div className="mode-toggle-bar">
                    <div className="mode-toggle" style={nightMode ? { float: "right" } : { float: "left" }}></div>
                </div>
            </div>
        </div>
    )
}

Menu.propTypes = {
    handleView: PropTypes.func,
    handleNightmode: PropTypes.func
}

const mapStateToProps = (state) => ({
    nightMode: state.mode.night
})

const mapDispatchToProps = (dispatch) => ({
    handleView: (arg) => {
        if (typeof arg === "boolean") {
            dispatch(nightMode(arg))
        } else {
            dispatch(selectView(arg.currentTarget.innerText))
        }
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
