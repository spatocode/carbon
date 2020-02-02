import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { searchSong } from "../actions"

const Header = ({ song="", handleSearch=f=>f }) => {
    return (
        <div className="Header">
            <div className="now-playing-song">{song}</div>
            <div className="music-search">
                <form onSubmit={handleSearch}>
                    <button type="submit" onClick={handleSearch}></button>
                    <input type="search" placeholder="Search music" onChange={handleSearch} />
                </form>
            </div>
        </div>
    )
}

Header.propTypes = {
    song: PropTypes.string,
    handleSearch: PropTypes.func,
    handleChange: PropTypes.func
}

const mapStateToProps = state => ({
    song: state.playState.song
})

const mapDispatchToProps = dispatch => ({
    handleSearch: (e) => dispatch(searchSong(e.target.value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
