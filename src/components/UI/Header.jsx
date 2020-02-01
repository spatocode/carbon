import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const Header = ({ song="", handleSearch=f=>f, handleChange=f=>f }) => {
    return (
        <div className="Header">
            <div className="now-playing-song">{song}</div>
            <div className="music-search">
                <form onSubmit={handleSearch}>
                    <button type="submit" onClick={handleSearch}></button>
                    <input type="search" placeholder="Search music" onChange={handleChange} />
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

})

const mapDispatchToProps = dispatch => ({
    handleSearch: () => {},
    handleChange: () => {}
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
