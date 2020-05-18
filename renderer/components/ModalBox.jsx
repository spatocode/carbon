import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
    updatePlaylist, addItemToNewPlaylist, playMedia,
    downloadAndStream
} from "../actions"
import { getPlayer } from "../utils"
import "./stylesheets/ModalBox.scss"
const { ipcRenderer } = window.require("electron")

class ModalBox extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            data: "",
            isPlaylist: false,
            isOpenURL: false,
            inputError: ""
        }
        this.closeModal = this.closeModal.bind(this)
        this.createNewPlaylist = this.createNewPlaylist.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.isOpenURL = this.isOpenURL.bind(this)
    }

    componentDidMount () {
        // create new playlist from application native menu in main process
        ipcRenderer.on("register-playlist", (event, arg) => {
            this.setState({ isPlaylist: true })
        })

        ipcRenderer.on("open-url", (event, arg) => {
            this.setState({ isOpenURL: true })
        })
    }

    closeModal () {
        const { isPlaylist, isOpenURL, inputError } = this.state
        const { itemToNewPlaylist, dispatch } = this.props
        this.setState({ data: "" })
        if (isPlaylist) {
            this.setState({ isPlaylist: false })
        }
        if (isOpenURL) {
            this.setState({ isOpenURL: false })
        }
        if (inputError) {
            this.setState({ inputError: "" })
        }
        if (itemToNewPlaylist) {
            return dispatch(addItemToNewPlaylist({}))
        }
    }

    createNewPlaylist (data) {
        if (!data) {
            this.setState({ inputError: "Please enter a valid name!" })
            return
        }
        const { isPlaylist } = this.state
        let { dispatch, itemToNewPlaylist } = this.props
        // check if we're calling from native menu or context menu
        itemToNewPlaylist = isPlaylist ? "" : itemToNewPlaylist
        dispatch(updatePlaylist(data, itemToNewPlaylist))
        this.closeModal()
    }

    isOpenURL (data) {
        const { dispatch } = this.props
        if (data.startsWith("https://") || data.startsWith("http://")) {
            const mediaPlayer = getPlayer()
            dispatch(playMedia(data, mediaPlayer))
            this.closeModal()
            return
        }
        this.setState({ inputError: "Please enter a valid url!" })
    }

    handleSubmit (e) {
        let { data, isOpenURL } = this.state
        e.preventDefault()
        if (data) {
            data = data.trim()
            if (isOpenURL) {
                this.isOpenURL(data)
            } else {
                this.createNewPlaylist(data)
            }
        }
    }

    handleTextChange (e) {
        const data = e.currentTarget.value
        this.setState({ data: data })
    }

    handleCheckChange (e) {
        const { dispatch } = this.props
        const checked = e.currentTarget.checked
        dispatch(downloadAndStream(checked))
    }

    render () {
        const { data, isPlaylist, isOpenURL, inputError } = this.state
        const { itemToNewPlaylist, downloadWhileStreaming } = this.props
        const title = isPlaylist || itemToNewPlaylist ? "Create Playlist" : "Enter URL"
        const isItemToNewPlaylist = itemToNewPlaylist
            ? Object.keys(itemToNewPlaylist).length > 0 : false
        return (
            <div className="modalbox" style={isItemToNewPlaylist ||
                isPlaylist || isOpenURL
                ? { display: "block" } : { display: "none" } }>
                <div className="modal-content">
                    <div className="header">
                        <span className="close" onClick={this.closeModal}>
                            &times;
                        </span>
                    </div>
                    <div className="body">
                        <h5>{title}</h5>
                        <form onSubmit={this.handleSubmit}>
                            <div className="input">
                                <input type="text" autoFocus
                                    onChange={this.handleTextChange} value={data} />
                            </div>
                            <div className="download" style={
                                isPlaylist || isItemToNewPlaylist
                                    ? { display: "none" }
                                    : { display: "block" }
                            }>
                                <label htmlFor="download">
                                    Download media while streaming
                                </label>
                                <input type="checkbox" name="download"
                                    onChange={this.handleCheckChange}
                                    checked={downloadWhileStreaming} />
                            </div>
                            <div className="input-error">
                                <span>{inputError}</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

ModalBox.propTypes = {
    itemToNewPlaylist: PropTypes.object
}

const mapStateToProps = (state) => ({
    itemToNewPlaylist: state.media.itemToNewPlaylist,
    downloadWhileStreaming: state.settings.downloadAndStream
})

export default connect(mapStateToProps)(ModalBox)
