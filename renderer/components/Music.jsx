import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { AutoSizer, Column, Table } from "react-virtualized"
import "react-virtualized/styles.css"
import { getPlayer } from "../utils"
import {
    updateFavourite, playMedia, addItemToNewPlaylist,
    updatePlaylist, removeMedia, selectView, deletePlaylist
} from "../actions"
import "./stylesheets/Music.scss"
const fs = window.require("fs")
const path = window.require("path")
const { Menu, dialog } = window.require("electron").remote

class Music extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            highlight: null,
            height: window.innerHeight-120
        }
        this.handleContextMenu = this.handleContextMenu.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handlePlay = this.handlePlay.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleNewPlaylist = this.handleNewPlaylist.bind(this)
        this.handleNewFavourite = this.handleNewFavourite.bind(this)
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount () {
        window.onresize = this.handleResize
    }

    componentWillUnmount () {
        window.onresize = null
    }

    shouldComponentUpdate (nextProps, nextState) {
        let { playlist, favourite, media, songs, visibleColumn } = this.props
        songs = songs || playlist || favourite
        if (songs !== nextProps.songs || media !== nextProps.media ||
            visibleColumn !== nextProps.visibleColumn ||
            this.state !== nextState) {
            return true
        }
        return false
    }

    handleResize () {
        this.setState({ height: window.innerHeight-120 })
    }

    handleContextMenu (param) {
        var removePlaylistItem = []
        var deletePlaylist = []
        var playlist = []
        var favMenuLabel = "Add to Favourite"
        var { favourite, playlists, view } = this.props

        favourite.some((fav) => {
            if (fav.file === param.rowData.file) {
                favMenuLabel = "Remove from Favourite"
                return true
            }
        })

        playlists.forEach((pl) => {
            if (pl[0] === view) {
                removePlaylistItem.push({
                    label: "Remove from Playlist",
                    click: this.handleNewPlaylist
                })
                deletePlaylist.push({
                    label: "Delete Playlist",
                    click: this.handleDelete
                })
                return
            }
            playlist.push({
                label: pl[0],
                click: this.handleNewPlaylist
            })
        })

        this.setState({ highlight: param.rowData })
        Menu.buildFromTemplate([
            { label: "Play", click: this.handlePlay },
            { type: "separator" },
            {
                label: "Add to Playlist",
                submenu: [{
                    label: "Add new Playlist",
                    click: this.handleNewPlaylist
                }].concat(playlist)
            },
            { label: favMenuLabel, click: this.handleNewFavourite },
            ...removePlaylistItem,
            ...deletePlaylist,
            { type: "separator" },
            { label: "Remove", click: this.handleRemove },
            { label: "Delete", click: this.handleDelete }
        ]).popup()
    }

    handleClick (param) {
        this.setState({ highlight: param.rowData })
    }

    handlePlay () {
        var { highlight } = this.state
        const { dispatch, playlist, songs, view } = this.props
        const player = getPlayer()
        // detect the view where this media is played from
        const source = songs ? "Music" : playlist ? `Playlists-${view}` : "Favourite"
        const media = {
            file: highlight.file,
            source: source
        }
        dispatch(playMedia(media, player))
    }

    handleRemove () {
        var { highlight } = this.state
        var { dispatch } = this.props
        dispatch(removeMedia(highlight.file))
    }

    handleDelete (e) {
        var { highlight } = this.state
        var { dispatch, view } = this.props
        if (e.label === "Delete Playlist") {
            dispatch(deletePlaylist(view))
            // Change view after deleting playlist so we don't render null
            dispatch(selectView("Now Playing"))
            return
        }

        var filename = path.basename(highlight.file)
        fs.unlink(highlight.file, (err) => {
            if (err) {
                const title = "Cannot delete file"
                const content = `
                    An error was encountered while attemting to delete 
                    the file <${filename}>. Please try again later.
                `
                dialog.showErrorBox(title, content)
            }
            dispatch(removeMedia(highlight.file))
        })
    }

    handleNewPlaylist (e) {
        const { highlight } = this.state
        const { dispatch, view } = this.props
        const playlist = e.label === "Remove from Playlist" ? view : e.label
        if (e.label === "Add new Playlist") {
            return dispatch(addItemToNewPlaylist(highlight))
        }
        dispatch(updatePlaylist(playlist, highlight))
    }

    handleNewFavourite () {
        const { dispatch } = this.props
        const { highlight } = this.state
        const newFav = highlight
        dispatch(updateFavourite(newFav))
    }

    render () {
        const { highlight, height } = this.state
        var { playlist, songs, favourite, media, visibleColumn } = this.props
        songs = songs || playlist || favourite
        return (
            <div className="tab-view" id="Music" style={{ height: height }}>
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <Table
                            ref="Table"
                            width={width}
                            height={height}
                            headerHeight={20}
                            className="table"
                            headerClassName="table-header"
                            rowHeight={25}
                            rowCount={songs.length}
                            rowGetter={({ index }) => songs[index]}
                            onRowClick={(param) => (this.handleClick(param))}
                            onRowDoubleClick={(param) => (this.handlePlay(param))}
                            onRowRightClick={(param) => (this.handleContextMenu(param))}
                            rowStyle={({ index }) => (
                                typeof songs[index] === "undefined"
                                    ? null : highlight === songs[index]
                                        ? { backgroundColor: "teal", color: "whitesmoke" }
                                        : media === songs[index].file
                                            ? { color: "rgb(255, 93, 75)" } : null)}>
                            {Object.entries(visibleColumn).map((item, i) =>
                                item[1]
                                    ? <Column key={i} label={item[0].charAt(0).toUpperCase()+item[0].slice(1)}
                                        dataKey={item[0]}
                                        width={i === 0 ? 45 : i === 3 ? 60 : i === 1 ? window.innerWidth-300 : window.innerWidth-500}
                                        minWidth={i === 0 ? 45 : i === 3 ? 60 : null}
                                        className="column-data"/>
                                    : null
                            )}
                        </Table>
                    )}
                </AutoSizer>
            </div>
        )
    }
}

Music.propTypes = {
    favourite: PropTypes.array,
    playlists: PropTypes.array,
    media: PropTypes.string,
    visibleColumn: PropTypes.object,
    view: PropTypes.string
}

Music.defaultProps = {
    favourite: [],
    playlists: [],
    media: "",
    visibleColumn: {},
    view: ""
}

const mapStateToProps = (state) => ({
    favourite: state.media.favourite,
    playlists: state.media.playlists,
    media: state.media.current,
    visibleColumn: state.settings.visibleColumn,
    view: state.view.category
})

export default connect(mapStateToProps, null)(Music)
