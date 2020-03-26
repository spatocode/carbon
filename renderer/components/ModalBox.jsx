import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { updatePlayist, registerNewPlayist } from "../actions"
import "./stylesheets/ModalBox.scss"
const { ipcRenderer } = window.require("electron")

class ModalBox extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            newPlayist: "",
            registerPlayist: false
        }
        this.closeModal = this.closeModal.bind(this)
        this.registerNewPlayist = this.registerNewPlayist.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount () {
        ipcRenderer.on("register-playist", (event, arg) => {
            this.setState({ registerPlayist: true })
        })
    }

    closeModal () {
        const { itemToNewPlayist, dispatch } = this.props
        if (itemToNewPlayist) {
            return dispatch(registerNewPlayist(""))
        }
        this.setState({ registerPlayist: false })
    }

    registerNewPlayist (e) {
        const { newPlayist, registerPlayist } = this.state
        let { dispatch, itemToNewPlayist } = this.props
        e.preventDefault()
        itemToNewPlayist = registerPlayist ? "" : itemToNewPlayist
        dispatch(updatePlayist(newPlayist, itemToNewPlayist))
        this.setState({ newPlayist: "" })
        if (registerPlayist) {
            this.setState({ registerPlayist: false })
        }
    }

    handleChange (e) {
        this.setState({ newPlayist: e.currentTarget.value })
    }

    render () {
        const { newPlayist, registerPlayist } = this.state
        const { itemToNewPlayist } = this.props
        return (
            <div className="modalbox" style={itemToNewPlayist || registerPlayist
                ? { display: "block" } : { display: "none" } }>
                <div className="modal-content">
                    <div className="header">
                        <span className="close" onClick={this.closeModal}>
                            &times;
                        </span>
                    </div>
                    <div className="body">
                        <h5>Create Playist</h5>
                        <form onSubmit={this.registerNewPlayist}>
                            <input placeholder="New Playist" type="input" autoFocus
                                onChange={this.handleChange} value={newPlayist} />
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
