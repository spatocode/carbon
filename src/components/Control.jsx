import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import "./stylesheets/Control.scss"

const Control = ({ song="Joyner Lucas - Devil's work", onPlay=f=>f, handleTimeUpdate=f=>f }) => {
    return (
        <div className="Control">
            <audio src={song} onTimeUpdate={handleTimeUpdate}></audio>
            <div className="sound-option">
                <span className="shuffle">S</span>
                <span className="repeat">R</span>
            </div>
            <div className="media-indicator">
                <div className="song-title">{song}</div>
                <div className="timer">
                    <div className="timer-count">00:00</div>
                    <div className="timer-bar">
                        <div className="timer-length"></div>
                    </div>
                    <div className="timer-count">-04:32</div>
                </div>
                <div className="rwd-play-stop-fwd">
                    <span className="rwd">R</span>
                    <span className="play" onClick={onPlay}>P</span>
                    <span className="stop">S</span>
                    <span className="fwd">F</span>
                </div>
            </div>
            <div className="volume">
                <span className="mute">M</span>
                <span className="volume-bar">V</span>
            </div>
        </div>
    )
}

Control.propTypes = {
    song: PropTypes.string,
    onPlay: PropTypes.func,
    onTimeUpdate: PropTypes.func
}

const mapStateToProps = () => ({

})

const mapDispatchToProps = () => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Control)
