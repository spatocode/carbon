import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { searchSong } from "../actions"
import "./stylesheets/Header.scss"

const Header = ({ handleSearch=f=>f }) => {
    return (
        <div className="Header">
            <div className="music-search">
                <form onSubmit={handleSearch}>
                    <button type="submit" onClick={handleSearch}>S</button>
                    <input type="search" placeholder="Search music" onChange={handleSearch} />
                </form>
            </div>
        </div>
    )
}

Header.propTypes = {
    handleSearch: PropTypes.func,
    handleChange: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
    handleSearch: (e) => dispatch(searchSong(e.target.value))
})

export default connect(null, mapDispatchToProps)(Header)
