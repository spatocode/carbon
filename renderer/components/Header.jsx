import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { searchSong } from "../actions"
import "./stylesheets/Header.scss"

class Header extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            value: "",
            isFetchingMedia: false,
            searchResult: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit (e) {
        e.preventDefault()
        this.setState({ isFetchingMedia: true })
        searchSong(this.state.value, function (result) {
            this.setState({ isFetchingMedia: false })
            this.setState({ searchResult: result })
        })
    }

    handleChange (e) {
        this.setState({ value: e.currentTarget.value })
    }

    render () {
        const { isUpdating } = this.props
        const { isFetchingMedia, searchResult } = this.state
        return (
            <div className="Header">
                <div className="update-library"
                    style={isUpdating ? { visibility: "visible" }
                        : { visibility: "hidden" }}>
                    <div className="spinner-wrapper"></div>
                    <div>Updating library...</div>
                </div>
                <div className="media-search">
                    <form onSubmit={this.handleSubmit}>
                        <span><button type="submit"></button></span>
                        <input type="search" placeholder="Search media" onChange={this.handleChange} />
                    </form>
                </div>
                <div className="search-result">
                    <div style={isFetchingMedia ? { display: "block" }
                        : { display: "none" }}>
                    </div>
                    {searchResult.map((item, i) =>
                        <div key={i}>{item}</div>
                    )}
                </div>
            </div>
        )
    }
}

Header.propTypes = {
    isUpdating: PropTypes.bool
}

const mapStateToProps = state => ({
    isUpdating: state.media.isUpdating
})

export default connect(mapStateToProps, null)(Header)
