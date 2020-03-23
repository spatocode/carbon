import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
    updateFavourite, playMedia, registerNewPlayist,
    updatePlayist, removeMedia
} from "../actions"
import "./stylesheets/Music.scss"
const fs = window.require("fs")
const path = window.require("path")
const { remote } = window.require("electron")
const { Menu, dialog } = remote

class Music extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            highlight: null,
            height: window.innerHeight-143
        }
        this.handleContextMenu = this.handleContextMenu.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handlePlay = this.handlePlay.bind(this)
        this.handleProperties = this.handleProperties.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleNewPlayist = this.handleNewPlayist.bind(this)
        this.handleNewFavourite = this.handleNewFavourite.bind(this)
        this.handleResize = this.handleResize.bind(this)
        this.formatMediaProp = this.formatMediaProp.bind(this)
    }

    componentDidMount () {
        window.onresize = this.handleResize
    }

    handleResize () {
        this.setState({ height: window.innerHeight-143 })
    }

    handleContextMenu (e) {
        var playist = []
        var favMenuLabel = "Add to Favourite"
        var { favourite, playists } = this.props

        favourite.forEach((fav) => {
            if (fav.file === e.currentTarget.className) {
                favMenuLabel = "Remove from Favourite"
            }
        })

        playists.forEach((pl) => {
            playist.push({
                label: pl[0],
                click: this.handleNewPlayist
            })
        })

        this.setState({ highlight: e.currentTarget.className })
        Menu.buildFromTemplate([
            { label: "Play", click: this.handlePlay },
            { type: "separator" },
            {
                label: "Add to Playist",
                submenu: [{
                    label: "Add new playist",
                    click: this.handleNewPlayist
                }].concat(playist)
            },
            { label: favMenuLabel, click: this.handleNewFavourite },
            { type: "separator" },
            { label: "Remove", click: this.handleRemove },
            { label: "Delete", click: this.handleDelete },
            { type: "separator" },
            { label: "Properties", click: this.handleProperties }
        ]).popup()
    }

    handleClick (e) {
        this.setState({ highlight: e.currentTarget.className })
    }

    handlePlay () {
        const { dispatch, player } = this.props
        dispatch(playMedia(this.state.highlight, player))
    }

    handleRemove () {
        var { highlight } = this.state
        var { dispatch } = this.props
        dispatch(removeMedia(highlight))
    }

    handleDelete () {
        var { highlight } = this.state
        var { dispatch } = this.props
        var filename = path.basename(highlight)
        fs.unlink(highlight, (err) => {
            if (err) {
                const title = "Cannot delete file"
                const content = `
                    An error was encountered while attemting to delete 
                    the file <${filename}>. Please try again later.
                `
                dialog.showErrorBox(title, content)
            }
            dispatch(removeMedia(highlight))
        })
    }

    handleNewPlayist (e) {
        const { highlight } = this.state
        const { dispatch } = this.props
        if (e.label === "Add new playist") {
            return dispatch(registerNewPlayist(highlight))
        }
        dispatch(updatePlayist(e.label, highlight))
    }

    handleNewFavourite () {
        const { dispatch } = this.props
        const newFav = this.state.highlight
        dispatch(updateFavourite(newFav))
    }

    handleProperties () {
    }

    formatMediaProp (mediaProp, lastIndex) {
        var fmt = mediaProp.toString().slice(0, lastIndex)
        if (mediaProp === fmt) {
            return fmt
        }
        return fmt+"..."
    }

    render () {
        const { highlight, height } = this.state
        var { songs, favourite } = this.props
        songs = songs || favourite
        return (
            <div className="tab-view" id="Music" style={{ height: height }}>
                <table className="">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Length</th>
                            <th>Artist</th>
                            <th>Album</th>
                            <th>Genre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song, i) =>
                            <tr key={i} className={song.file}
                                onContextMenu={this.handleContextMenu}
                                onClick={this.handleClick}
                                onDoubleClick={this.handlePlay}
                                style={highlight === song.file
                                    ? { backgroundColor: "teal", color: "whitesmoke" } : null}>
                                <td>{i}</td>
                                {song.title
                                    ? <td>{this.formatMediaProp(song.title.toString(), 29)}
                                    </td>
                                    : <td>{this.formatMediaProp(song.file_name.toString(), 29)}</td>
                                }

                                {song.duration
                                    ? <td>{
                                        song.duration[4].slice(0, 2) === "00"
                                            ? song.duration[4].slice(3, 8)
                                            : song.duration[4].slice(0, 8)
                                    }</td>
                                    : <td>Unknown</td>
                                }

                                {song.artist
                                    ? <td>{this.formatMediaProp(song.artist.toString(), 20)}</td>
                                    : <td>Unknown</td>
                                }

                                {song.album
                                    ? <td>{this.formatMediaProp(song.album.toString(), 20)}</td>
                                    : <td>Unknown</td>
                                }

                                {song.genre
                                    ? <td>{this.formatMediaProp(song.genre.toString(), 20)}</td>
                                    : <td>Unknown</td>
                                }
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

Music.propTypes = {
    favourite: PropTypes.array,
    playists: PropTypes.array,
    player: PropTypes.object
}

Music.defaultProps = {
    favourite: [],
    playists: [],
    player: null
}

const mapStateToProps = (state) => ({
    favourite: state.media.library.filter(song => state.media.favourite.includes(song.file)),
    playists: state.media.playists,
    player: state.media.player
})

export default connect(mapStateToProps, null)(Music)
