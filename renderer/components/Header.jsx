import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { searchSong } from "../actions"
import "./stylesheets/Header.scss"
const path = require("path")

class Header extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            value: "",
            isSearchingMedia: false,
            searchResult: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit (e) {
        const { library } = this.props
        e.preventDefault()
        this.requestSearching()

        var results = searchSong(this.state.value, library)
        this.setState({ searchResult: results })
        this.searchingCompleted()
    }

    handleChange (e) {
        const { library } = this.props
        this.setState({ value: e.currentTarget.value })
        this.requestSearching()

        var results = searchSong(e.currentTarget.value, library)
        this.setState({ searchResult: results })
        this.searchingCompleted()
    }

    requestSearching () {
        this.setState({ isSearchingMedia: true })
    }

    searchingCompleted () {
        this.setState({ isSearchingMedia: false })
    }

    render () {
        const { isUpdating } = this.props
        const { isSearchingMedia, searchResult } = this.state
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
                <div className="search-result" style={searchResult.length < 1 ? { display: "none" }
                    : { display: "block" }}>
                    <div className="search-indicator" style={isSearchingMedia
                        ? { display: "block" } : { display: "none" }}>
                        <div className="search-marquee"></div>
                    </div>
                    {searchResult.map((item, i) =>
                        <div key={i} className={`${item} result-item`}>
                            {path.basename(item, path.extname(item))}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

Header.propTypes = {
    isUpdating: PropTypes.bool,
    library: PropTypes.array
}

Header.defaultProps = {
    isUpdating: false,
    library: []
}

const mapStateToProps = state => ({
    isUpdating: state.media.isUpdating,
    library: state.media.library
})

export default connect(mapStateToProps, null)(Header)
