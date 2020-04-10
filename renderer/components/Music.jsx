import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { AutoSizer, Column, Table } from "react-virtualized"
import "react-virtualized/styles.css"
import { getPlayer } from "../utils"
import {
    updateFavourite, playMedia, registerNewPlayist,
    updatePlayist, removeMedia
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
            height: window.innerHeight-143
        }
        this.handleContextMenu = this.handleContextMenu.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handlePlay = this.handlePlay.bind(this)
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

    componentWillUnmount () {
        window.onresize = null
    }

    shouldComponentUpdate (nextProps, nextState) {
        let { favourite, media, songs, visibleColumn } = this.props
        songs = songs || favourite
        if (songs !== nextProps.songs || media !== nextProps.media ||
            visibleColumn !== nextProps.visibleColumn ||
            this.state !== nextState) {
            return true
        }
        return false
    }

    handleResize () {
        this.setState({ height: window.innerHeight-143 })
    }

    handleContextMenu (param) {
        var playist = []
        var favMenuLabel = "Add to Favourite"
        var { favourite, playists } = this.props

        favourite.forEach((fav) => {
            if (fav.file === param.rowData.file) {
                favMenuLabel = "Remove from Favourite"
            }
        })

        playists.forEach((pl) => {
            playist.push({
                label: pl[0],
                click: this.handleNewPlayist
            })
        })

        this.setState({ highlight: param.rowData.file })
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
            { label: "Delete", click: this.handleDelete }
        ]).popup()
    }

    handleClick (param) {
        this.setState({ highlight: param.rowData.file })
    }

    handlePlay () {
        const { dispatch } = this.props
        const player = getPlayer()
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

    formatMediaProp (mediaProp, index) {
        const lastIndex = index === 1 ? 29 : 20
        const fmt = mediaProp.slice(0, lastIndex)
        if (mediaProp === fmt) {
            return fmt
        }
        return fmt+"..."
    }

    render () {
        const { highlight, height } = this.state
        var { songs, favourite, media, visibleColumn } = this.props
        songs = songs || favourite
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
                                    ? null : highlight === songs[index].file
                                        ? { backgroundColor: "teal", color: "whitesmoke" }
                                        : media === songs[index].file
                                            ? { color: "salmon" } : null)}>
                            {Object.entries(visibleColumn).map((item, i) =>
                                item[1]
                                    ? <Column key={i} label={item[0].charAt(0).toUpperCase()+item[0].slice(1).replace("_", " ")}
                                        dataKey={item[0].toLowerCase().replace("_", " ")}
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
    playists: PropTypes.array,
    media: PropTypes.string,
    visibleColumn: PropTypes.object
}

Music.defaultProps = {
    favourite: [],
    playists: [],
    media: "",
    visibleColumn: {}
}

const mapStateToProps = (state) => ({
    favourite: state.media.library.filter(song => state.media.favourite.includes(song.file)),
    playists: state.media.playists,
    media: state.media.current,
    visibleColumn: state.settings.visibleColumn
})

export default connect(mapStateToProps, null)(Music)
