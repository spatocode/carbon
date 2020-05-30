import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { selectView, showFullMenu } from "../actions"
import { version } from "../../package.json"
import * as icon from "../assets/staticbase64"
import "./stylesheets/Menu.scss"
const { ipcRenderer } = window.require("electron")

class Menu extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            show: false,
            height: window.innerHeight - 95
        }
        this.showDropdown = this.showDropdown.bind(this)
        this.handleView = this.handleView.bind(this)
    }

    componentDidMount () {
        ipcRenderer.on("maximize", (event, maximize) => {
            if (maximize) {
                this.setState({ height: window.innerHeight * 1.15 })
            } else {
                this.setState({ height: window.innerHeight - 95 })
            }
        })
    }

    handleView (e) {
        const { dispatch } = this.props
        let val = e.currentTarget.className
        const vals = val.split(" ")
        if (vals[0] === "menu-list") {
            const view = vals[1]
            val = view.replace("_", " ").charAt().toUpperCase() + view.slice(1)
        } else {
            val = e.currentTarget.innerHTML
        }
        dispatch(selectView(val))
    }

    showDropdown () {
        const { show } = this.state
        const { dispatch, fullMenu } = this.props
        this.setState({ show: !show })
        if (fullMenu) {
            return
        }
        dispatch(showFullMenu(true))
    }

    render () {
        const { show, height } = this.state
        const { playlists, fullMenu } = this.props
        // TODO: Provide a separate component for menu list
        return (
            <div className="Menu" style={ fullMenu
                ? { height: height, width: "200px" } : { height: height, width: "55px" }}>
                { fullMenu
                    ? <div className="title">
                        <img src={`data:image/png;base64,${icon.appIcon}`} width="40" height="40"/>
                        <div>{version}</div>
                    </div>
                    : null
                }
                <div className="menu-list now_playing" onClick={this.handleView}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.nowplaying}`}
                            width="13" height="13" />
                    </span>
                    <span>{fullMenu ? "Now Playing" : null}</span>
                </div>
                <div className="menu-list music" onClick={this.handleView}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.music}`}
                            width="16" height="16" />
                    </span>
                    <span>{fullMenu ? "Music" : null}</span>
                </div>
                <div className={(show && playlists.length > 0)
                    ? "menu-list no-hover" : "menu-list"}
                onClick={this.showDropdown}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.playlist}`}
                            width="16" height="16" />
                    </span>
                    <span>{fullMenu ? "Playlists" : null}</span>
                    <div className="menu-dropdown"
                        style={show ? { display: "block" } : { display: "none" }}>
                        {playlists.map((playlist, i) =>
                            <div key={i} className="menu-sublist" onClick={this.handleView}>
                                {playlist[0]}
                            </div>
                        )}
                    </div>
                </div>
                <div className="menu-list favourite" onClick={this.handleView}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.favourite}`}
                            width="12" height="12" />
                    </span>
                    <span>{fullMenu ? "Favourite" : null}</span>
                </div>
                <div className="menu-list setting" onClick={this.handleView}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.settings}`}
                            width="13" height="13" />
                    </span>
                    <span>{fullMenu ? "Setting" : null}</span>
                </div>
            </div>
        )
    }
}

Menu.propTypes = {
    playlists: PropTypes.array,
    fullMenu: PropTypes.bool
}

Menu.defaultProps = {
    playlists: [],
    fullMenu: true
}

const mapStateToProps = (state) => ({
    playlists: state.media.playlists,
    fullMenu: state.view.fullMenu
})

export default connect(mapStateToProps)(Menu)
