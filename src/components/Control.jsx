import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const Control = ({ song="", onPlay=f=>f, handleTimeUpdate=f=>f }) => {
    return (
        <div className="Control">
            <audio src={song} onTimeUpdate={handleTimeUpdate}></audio>
            <div className="song-title">{song}</div>
            <div className="rwd-play-stop-fwd">
                <div className="rwd"></div>
                <div className="play" onClick={onPlay}></div>
                <div className="stop"></div>
                <div className="fwd"></div>
            </div>
            <div className="timer">
                <div className="timer-positive">00:00</div>
                <div className="timer-bar-node">
                    <div className="timer-bar"></div>
                </div>
                <div className="timer-negative">-04:32</div>
            </div>
            <div className="shuffle-repeat">
                <div className="shuffle"></div>
                <div className="repeat"></div>
            </div>
            <div className="volume">
                <div className="mute"></div>
                <div className="volume-bar"></div>
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
