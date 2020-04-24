import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
    updatePlayist, addItemToNewPlayist, playMedia,
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
            isPlayist: false,
            isOpenURL: false,
            inputError: ""
        }
        this.closeModal = this.closeModal.bind(this)
        this.createNewPlayist = this.createNewPlayist.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.isOpenURL = this.isOpenURL.bind(this)
    }

    componentDidMount () {
        // create new playist from application native menu in main process
        ipcRenderer.on("register-playist", (event, arg) => {
            this.setState({ isPlayist: true })
        })

        ipcRenderer.on("open-url", (event, arg) => {
            this.setState({ isOpenURL: true })
        })
    }

    closeModal () {
        const { isPlayist, isOpenURL, inputError } = this.state
        const { itemToNewPlayist, dispatch } = this.props
        this.setState({ data: "" })
        if (isPlayist) {
            this.setState({ isPlayist: false })
        }
        if (isOpenURL) {
            this.setState({ isOpenURL: false })
        }
        if (inputError) {
            this.setState({ inputError: "" })
        }
        if (itemToNewPlayist) {
            return dispatch(addItemToNewPlayist({}))
        }
    }

    createNewPlayist (data) {
        if (!data) {
            this.setState({ inputError: "Please enter a valid name!" })
            return
        }
        const { isPlayist } = this.state
        let { dispatch, itemToNewPlayist } = this.props
        // check if we're calling from native menu or context menu
        itemToNewPlayist = isPlayist ? "" : itemToNewPlayist
        dispatch(updatePlayist(data, itemToNewPlayist))
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
                this.createNewPlayist(data)
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
        const { data, isPlayist, isOpenURL, inputError } = this.state
        const { itemToNewPlayist, downloadWhileStreaming } = this.props
        const title = isPlayist || itemToNewPlayist ? "Create Playist" : "Enter URL"
        const isItemToNewPlayist = itemToNewPlayist
            ? Object.keys(itemToNewPlayist).length > 0 : false
        return (
            <div className="modalbox" style={isItemToNewPlayist ||
                isPlayist || isOpenURL
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
                                isPlayist || isItemToNewPlayist
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
    itemToNewPlayist: PropTypes.object
}

const mapStateToProps = (state) => ({
    itemToNewPlayist: state.media.itemToNewPlayist,
    downloadWhileStreaming: state.settings.downloadAndStream
})

export default connect(mapStateToProps)(ModalBox)
