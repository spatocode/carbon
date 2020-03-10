import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { selectView, nightMode, updatePlayist } from "../actions"
import { version } from "../../package.json"
import "./stylesheets/Menu.scss"

class Menu extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            show: false,
            newPlayist: ""
        }
        this.showDropdown = this.showDropdown.bind(this)
        this.handleNightmode = this.handleNightmode.bind(this)
        this.handleView = this.handleView.bind(this)
        this.registerNewPlayist = this.registerNewPlayist.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (e) {
        this.setState({ newPlayist: e.currentTarget.value })
    }

    registerNewPlayist (e) {
        const { dispatch, itemToNewPlayist } = this.props
        e.preventDefault()
        this.setState({ newPlayist: "" })
        dispatch(updatePlayist(this.state.newPlayist, itemToNewPlayist))
    }

    handleNightmode () {
        const { dispatch, night } = this.props
        dispatch(nightMode(!night))
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
        const { show, newPlayist } = this.state
        const { itemToNewPlayist, playists } = this.props
        return (
            <div className="Menu">
                <div className="title">
                    <img src=""/>
                    {version}
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span></span>
                    <span>Now Playing</span>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span><img src=""/></span>
                    <span>Music</span>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span></span>
                    <span>Video</span>
                </div>
                <div className={(show && playists.length > 0) ? "menu-list no-hover" : "menu-list"}>
                    <span></span>
                    <span onClick={this.showDropdown}>Playists</span>
                    <div className="menu-dropdown"
                        style={show ? { display: "block" } : { display: "none" }}>
                        <form onSubmit={this.registerNewPlayist}
                            style={itemToNewPlayist ? { display: "block" } : { display: "none" }}>
                            <input placeholder="New Playist" type="input" autoFocus
                                onChange={this.handleChange} value={newPlayist}
                                style={itemToNewPlayist ? { display: "block" } : { display: "none" }} />
                        </form>
                        {playists.map((playist, i) =>
                            <div key={i} className="menu-sublist">{playist[0]}</div>
                        )}
                    </div>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span></span>
                    <span>Favourite</span>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span></span>
                    <span>Downloads</span>
                </div>
                <div className="menu-list" onClick={this.handleView}>
                    <span></span>
                    <span>Settings</span>
                </div>
                <div className="menu-list" onClick={this.handleNightmode}>
                    <span>Night mode</span>
                    <div className="mode-toggle-bar">
                        <div className="mode-toggle" style={nightMode ? { float: "right" } : { float: "left" }}></div>
                    </div>
                </div>
            </div>
        )
    }
}

Menu.propTypes = {
    night: PropTypes.bool,
    itemToNewPlayist: PropTypes.string,
    playists: PropTypes.array
}

const mapStateToProps = (state) => ({
    night: state.mode.night,
    itemToNewPlayist: state.media.itemToNewPlayist,
    playists: state.media.playists
})

export default connect(mapStateToProps, null)(Menu)
