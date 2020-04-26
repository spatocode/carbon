import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { selectView } from "../actions"
import { version } from "../../package.json"
import * as icon from "../assets/staticbase64"
import "./stylesheets/Menu.scss"
const { ipcRenderer } = window.require("electron")

class Menu extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            show: false,
            height: window.innerHeight - 120
        }
        this.showDropdown = this.showDropdown.bind(this)
        this.handleView = this.handleView.bind(this)
    }

    componentDidMount () {
        ipcRenderer.on("maximize", (event, maximize) => {
            if (maximize) {
                this.setState({ height: window.innerHeight * 1.15 })
            } else {
                this.setState({ height: window.innerHeight - 120 })
            }
        })
    }

    handleView (e) {
        const { dispatch } = this.props
        dispatch(selectView(e.currentTarget.innerText))
    }

    showDropdown () {
        const { show } = this.state
        this.setState({ show: !show })
    }

    render () {
        const { show, height } = this.state
        const { playists } = this.props
        // TODO: Provide a separate component for menu list
        return (
            <div className="Menu" style={{ height: height }}>
                <div className="title">
                    <h1>carbon</h1>
                    <div>{version}</div>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.nowplaying}`}
                            width="13" height="13" />
                    </span>
                    <span>Now Playing</span>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.music}`}
                            width="16" height="16" />
                    </span>
                    <span>Music</span>
                </div>
                <div className={(show && playists.length > 0) ? "menu-list no-hover" : "menu-list"}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.playist}`}
                            width="16" height="16" />
                    </span>
                    <span onClick={this.showDropdown}>Playists</span>
                    <div className="menu-dropdown"
                        style={show ? { display: "block" } : { display: "none" }}>
                        {playists.map((playist, i) =>
                            <div key={i} className="menu-sublist" onClick={this.handleView}>
                                {playist[0]}
                            </div>
                        )}
                    </div>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.favourite}`}
                            width="12" height="12" />
                    </span>
                    <span>Favourite</span>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span className="menu-icon">
                        <img src={`data:image/png;base64,${icon.settings}`}
                            width="13" height="13" />
                    </span>
                    <span>Setting</span>
                </div>
            </div>
        )
    }
}

Menu.propTypes = {
    playists: PropTypes.array
}

const mapStateToProps = (state) => ({
    playists: state.media.playists
})

export default connect(mapStateToProps)(Menu)
