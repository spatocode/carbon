import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { updatePlayist, addItemToNewPlayist, playMedia } from "../actions"
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
        this.handleChange = this.handleChange.bind(this)
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
        if (itemToNewPlayist) {
            return dispatch(addItemToNewPlayist(""))
        }
        if (isPlayist) {
            this.setState({ isPlayist: false })
        }
        if (isOpenURL) {
            this.setState({ isOpenURL: false })
        }
        if (inputError) {
            this.setState({ inputError: "" })
        }
        this.setState({ data: "" })
    }

    createNewPlayist (data) {
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
                this.createNewPlayist()
            }
        }
    }

    handleChange (e) {
        const data = e.currentTarget.value
        this.setState({ data: data })
    }

    render () {
        const { data, isPlayist, isOpenURL, inputError } = this.state
        const { itemToNewPlayist } = this.props
        const title = isPlayist || itemToNewPlayist ? "Create Playist" : "Enter URL"
        return (
            <div className="modalbox" style={itemToNewPlayist ||
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
                            <input type="input" autoFocus
                                onChange={this.handleChange} value={data} />
                            <div style={{ color: "red", fontSize: "12px" }}>
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
    itemToNewPlayist: PropTypes.string
}

const mapStateToProps = (state) => ({
    itemToNewPlayist: state.media.itemToNewPlayist
})

export default connect(mapStateToProps)(ModalBox)
