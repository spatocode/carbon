import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { updateFavourite, playMedia, registerNewPlayist, updatePlayist } from "../actions"
import "./stylesheets/Music.scss"
const { remote } = window.require("electron")
const { Menu } = remote

class Music extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            highlight: null
        }
        this.handleContextMenu = this.handleContextMenu.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handlePlay = this.handlePlay.bind(this)
        this.handleProperties = this.handleProperties.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleNewPlayist = this.handleNewPlayist.bind(this)
        this.handleNewFavourite = this.handleNewFavourite.bind(this)
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

    }

    handleDelete () {
        // TODO: delete media
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

    render () {
        const { highlight } = this.state
        var { songs, favourite } = this.props
        songs = songs || favourite
        return (
            <div className="tab-view" id="Music">
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
                                    ? <td>{song.title.toString().slice(0, 29)}</td>
                                    : <td>{song.file_name.toString().slice(0, 29)}</td>
                                }

                                {song.duration
                                    ? <td>{song.duration[1].replace("mn ", ":").replace("s", "")}</td>
                                    : <td>Unknown</td>
                                }

                                {song.artist
                                    ? <td>{song.artist.toString().slice(0, 20)}</td>
                                    : <td>Unknown</td>
                                }

                                {song.album
                                    ? <td>{song.album.toString().slice(0, 20)}</td>
                                    : <td>Unknown</td>
                                }

                                {song.genre
                                    ? <td>{song.genre.toString().slice(0, 20)}</td>
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
