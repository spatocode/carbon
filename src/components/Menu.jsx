import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const Menu = ({ onNowPlaying=f=>f, onPlayists=f=>f }) => {
    return (
        <div className="Menu">
            <div className="now-playing" onClick={onNowPlaying}>Now Playing</div>
            <div className="playists" onClick={onPlayists}>Playists</div>
            <div className="music">Music</div>
            <div className="video">Video</div>
        </div>
    )
}

Menu.propTypes = {
    onNowPlaying: PropTypes.func,
    onPlayists: PropTypes.func
}

const mapStateToProps = () => ({

})

const mapDispatchToProps = () => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
