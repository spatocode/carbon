import path from "path"
import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { playMedia } from "../actions"
import "./stylesheets/Control.scss"
const { ipcRenderer } = window.require("electron")

class Control extends React.Component {
    constructor (props) {
        super(props)
        this.mediaPlayer = React.createRef()
        this.currentTime = React.createRef()
        this.timerBar = React.createRef()
        this.timerLength = React.createRef()
        this.duration = React.createRef()
        this.handlePlay = this.handlePlay.bind(this)
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    }

    handlePlay () {
        const { media, dispatch } = this.props
        dispatch(playMedia(media, this.mediaPlayer))
        console.log(this.mediaPlayer.current)
    }

    handleTimeUpdate () {
        var hourValue, minuteValue, secondValue, durHourValue,
            durMinValue, durSecValue
        var mediaPlayer = this.mediaPlayer.current
        var currentTime = this.currentTime.current
        var duration = this.duration.current
        var timerBar = this.timerBar.current
        var timerLength = this.timerLength.current

        var hours = Math.floor(mediaPlayer.currentTime / 3600)
        var minutes = Math.floor(mediaPlayer.currentTime / 60)
        var seconds = Math.floor(mediaPlayer.currentTime - minutes * 60)

        var currentDuration = mediaPlayer.duration - mediaPlayer.currentTime
        // mediaplayer.duration is not swift in getting duration at initially.
        // Using the OR operator prevents NAN value from showing on screen
        var durHours = Math.floor(currentDuration / 3600) || 0
        var durMinutes = Math.floor(currentDuration / 60) || 0
        var durSeconds = Math.floor(currentDuration - durMinutes * 60) || 0

        // format the time values properly
        if (hours <= 0) {
            hourValue = ""
        } else if (hours < 10) {
            hourValue = `0${hours}:`
        } else {
            hourValue = hours
        }

        if (minutes < 10) {
            minuteValue = `0${minutes}:`
        } else {
            minuteValue = `${minutes}:`
        }

        if (seconds < 10) {
            secondValue = `0${seconds}`
        } else {
            secondValue = seconds
        }

        if (durHours <= 0) {
            durHourValue = ""
        } else if (durHours < 10) {
            durHourValue = `0${durHours}:`
        } else {
            durHourValue = durHours
        }

        if (durMinutes < 10) {
            durMinValue = `0${durMinutes}:`
        } else {
            durMinValue = durMinutes
        }

        if (durSeconds < 10) {
            durSecValue = `0${durSeconds}`
        } else {
            durSecValue = durSeconds
        }

        var durationTime = `${durHourValue}${durMinValue}${durSecValue}`
        var mediaTime = `${hourValue}${minuteValue}${secondValue}`
        var length = timerBar.clientWidth * (mediaPlayer.currentTime/mediaPlayer.duration)
        currentTime.innerText = mediaTime
        duration.innerText = durationTime
        timerLength.style.width = `${length}px`
    }

    render () {
        const { media, dispatch } = this.props
        const mediaName = path.basename(media, path.extname(media))
        ipcRenderer.on("open-file", (event, file) => {
            dispatch(playMedia(file[0], this.mediaPlayer))
        })

        return (
            <div className="Control">
                <audio ref={this.mediaPlayer} onTimeUpdate={this.handleTimeUpdate}></audio>
                <div className="sound-option">
                    <span className="shuffle"></span>
                    <span className="repeat"></span>
                </div>
                <div className="media-indicator">
                    <div className="song-title">{mediaName}</div>
                    <div className="timer">
                        <div className="timer-count" ref={this.currentTime}>00:00</div>
                        <div className="timer-bar" ref={this.timerBar}>
                            <div className="timer-length" ref={this.timerLength}></div>
                        </div>
                        <div className="timer-count" ref={this.duration}>00:00</div>
                    </div>
                    <div className="rwd-play-stop-fwd">
                        <span className="rwd"></span>
                        <span className="play" onClick={this.handlePlay}></span>
                        <span className="stop"></span>
                        <span className="fwd"></span>
                    </div>
                </div>
                <div className="volume">
                    <span className="mute"></span>
                    <span className="volume-bar">V</span>
                </div>
            </div>
        )
    }
}

Control.propTypes = {
    media: PropTypes.string,
    loadMedia: PropTypes.func
}

Control.defaultProps = {
    media: "",
    loadMedia: f=>f
}

const mapStateToProps = (state) => ({
    media: state.media.current
})

export default connect(mapStateToProps)(Control)
