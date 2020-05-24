import React from "react"
import { connect } from "react-redux"
import {
    updateVisibleColumn, requestUpdateLibrary,
    updateLibrary
} from "../actions"
const { ipcRenderer, remote } = window.require("electron")
const { app, dialog } = remote
const Store = window.require("electron-store")

class MusicSetting extends React.Component {
    constructor (props) {
        super(props)
        const store = new Store()
        const locations = store.get("libLocation")
        this.state = {
            locations: locations
        }
        this.addLibLocation = this.addLibLocation.bind(this)
        this.removeLibLocation = this.removeLibLocation.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updateLibrary = this.updateLibrary.bind(this)
    }

    addLibLocation () {
        const home = app.getPath("home")
        const store = new Store()
        dialog.showOpenDialog(null, {
            title: "Select library location",
            properties: ["openDirectory"],
            defaultPath: home
        }).then(result => {
            const dir = result.filePaths[0]
            const location = store.get("libLocation")
            if (location.includes(dir) || typeof dir === "undefined") {
                return
            }
            const dirs = [...location, result.filePaths[0]]
            store.set("libLocation", dirs)
            this.setState({ locations: dirs })
            this.updateLibrary(dirs)
        }).catch(err => {
            console.log(err)
        })
    }

    removeLibLocation (e) {
        const store = new Store()
        const { locations } = this.state
        if (locations.length < 2) {
            return
        }
        const location = locations.filter((loc) => {
            return loc !== e.currentTarget.innerText.slice(0, -1)
        })
        this.setState({ locations: location })
        store.set("libLocation", location)
        this.updateLibrary(location)
    }

    updateLibrary (location) {
        const { dispatch } = this.props
        let shouldUpdate = false
        ipcRenderer.send("should-update", location)
        shouldUpdate = true
        dispatch(requestUpdateLibrary())
        ipcRenderer.on("update-library", (event, files) => {
            // Check if this event is as a result of this function call
            if (shouldUpdate) {
                dispatch(updateLibrary(files))
            }
        })
    }

    handleChange (e) {
        const { dispatch } = this.props
        const obj = {}
        obj[`${e.currentTarget.id}`] = e.currentTarget.checked
        dispatch(updateVisibleColumn(obj))
    }

    render () {
        const { locations } = this.state
        const { visibility, visibleColumn } = this.props
        return (
            <div className="MusicSetting">
                <form>
                    <div className="setting-head">
                        <h6>Visible Columns</h6>
                        <div className="visible-column">
                            {[1, 2, 3].map((v, i) =>
                                <div key={i} style={i === 0 || i === 1
                                    ? { marginRight: "50px" } : null}>
                                    {visibility.map((item, j) =>
                                        (i === 0 && j < 5) || (i === 1 && j >= 5 && j <= 9) || (i === 2 && j > 9 && j <= 14)
                                            ? <div key={j}>
                                                <input type="checkbox"
                                                    id={item.toLowerCase()}
                                                    name={item.toLowerCase()}
                                                    onChange={this.handleChange}
                                                    checked={visibleColumn[`${item.toLowerCase()}`]} />
                                                <label htmlFor={item.toLowerCase()}>
                                                    {item}
                                                </label>
                                            </div>
                                            : null
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="setting-head">
                        <h6>Library Location</h6>
                        <div className="library-location">
                            <input type="button" value="Choose location" name="location"
                                onClick={this.addLibLocation} />
                            <ul>
                                {locations.map((loc, i) =>
                                    <li key={i} onClick={this.removeLibLocation}>
                                        {loc}<span>&times;</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

MusicSetting.propTypes = {

}

const mapStateToProps = (state) => ({
    visibleColumn: state.settings.visibleColumn
})

export default connect(mapStateToProps)(MusicSetting)
