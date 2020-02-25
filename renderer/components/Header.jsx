import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { searchSong } from "../actions"
import "./stylesheets/Header.scss"

const Header = ({ library=[], isUpdating=false, handleSearch=f=>f }) => {
    const handleChange = (e) => {
        // TODO: Write data mining algorithm
    }
    return (
        <div className="Header">
            <div className="update-library"
                style={isUpdating ? { visibility: "visible" }
                    : { visibility: "hidden" }}>
                <div className="spinner-wrapper"></div>
                <div>Updating library...</div>
            </div>
            <div className="music-search">
                <form onSubmit={handleSearch}>
                    <button type="submit" onClick={handleSearch}>S</button>
                    <input type="search" placeholder="Search music" onChange={handleChange} />
                </form>
            </div>
        </div>
    )
}

Header.propTypes = {
    handleSearch: PropTypes.func,
    handleChange: PropTypes.func
}

const mapStateToProps = state => ({
    isUpdating: state.media.isUpdating,
    library: state.media.library
})

const mapDispatchToProps = dispatch => ({
    handleSearch: (e) => dispatch(searchSong(e.target.value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
