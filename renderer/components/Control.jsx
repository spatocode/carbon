import path from "path"
import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { playMedia, setCurrentMediaMode } from "../actions"
import "./stylesheets/Control.scss"
import rewindIcon from "../assets/backward.png"
import fastFwdIcon from "../assets/forward.png"
import pauseIcon from "../assets/pause.png"
import playIcon from "../assets/play.png"
// import activeShuffleIcon from "../assets/shuffle-active.png"
import shuffleIcon from "../assets/shuffle.png"
// import activeRepeatIcon from "../assets/repeat-active.png"
import repeatIcon from "../assets/repeat.png"
import soundIcon from "../assets/volume.png"
const { ipcRenderer } = window.require("electron")

class Control extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            clickTime: null,
            repeat: false,
            muted: false,
            volume: 100
        }
        this.mediaPlayer = React.createRef()
        this.currentTime = React.createRef()
        this.timerBar = React.createRef()
        this.timerLength = React.createRef()
        this.duration = React.createRef()
        this.volumeHandle = React.createRef()
        this.handlePlay = this.handlePlay.bind(this)
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
        this.handleNext = this.handleNext.bind(this)
        this.handlePrevious = this.handlePrevious.bind(this)
        this.handleFastFoward = this.handleFastFoward.bind(this)
        this.handleRewind = this.handleRewind.bind(this)
        this.handleClearInterval = this.handleClearInterval.bind(this)
        this.handleRepeat = this.handleRepeat.bind(this)
        this.handleMute = this.handleMute.bind(this)
        this.handleVolume = this.handleVolume.bind(this)
    }

    componentDidMount () {
        const { dispatch } = this.props
        dispatch(playMedia("", this.mediaPlayer.current))
    }

    handlePlay () {
        var mediaPlayer = this.mediaPlayer.current
        const { media, dispatch } = this.props
        if (this.fastFowardInterval || this.rewindInterval) {
            clearInterval(this.fastFowardInterval)
            clearInterval(this.rewindInterval)
        }

        if (mediaPlayer.paused) {
            dispatch(playMedia(media, this.mediaPlayer.current))
        } else {
            mediaPlayer.pause()
            dispatch(setCurrentMediaMode("Paused"))
        }
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

    handleRepeat () {
        const { repeat } = this.state
        this.mediaPlayer.current.loop = !repeat
        this.setState({ repeat: !repeat })
    }

    handleMute () {
        const { mute } = this.state
        this.mediaPlayer.current.muted = !mute
        this.setState({ mute: !mute })
    }

    handleVolume (e) {
        var mediaPlayer = this.mediaPlayer.current
        this.setState({ volume: e.currentTarget.value })
        mediaPlayer.volume = e.currentTarget.value / 100
    }

    stopMedia () {
        const { dispatch } = this.props
        var mediaPlayer = this.mediaPlayer.current
        mediaPlayer.pause()
        dispatch(setCurrentMediaMode("Paused"))
        mediaPlayer.currentTime = 0
        clearInterval(this.controlInterval)
    }

    handleClearInterval () {
        clearTimeout(this.controlTimeout)
        clearInterval(this.controlInterval)
    }

    handleFastFoward () {
        this.setState({ clickTime: Math.floor(Date.now()/1000) })
        var mediaPlayer = this.mediaPlayer.current
        this.controlTimeout = setTimeout(() => {
            this.controlInterval = setInterval(() => {
                if (mediaPlayer.currentTime >= mediaPlayer.duration - 3) {
                    this.stopMedia()
                } else {
                    mediaPlayer.currentTime += 3
                }
            }, 200)
        }, 800)
    }

    handleRewind () {
        this.setState({ clickTime: Math.floor(Date.now()/1000) })
        var mediaPlayer = this.mediaPlayer.current
        this.controlTimeout = setTimeout(() => {
            this.controlInterval = setInterval(() => {
                if (mediaPlayer.currentTime <= 3) {
                    this.stopMedia()
                } else {
                    mediaPlayer.currentTime -= 3
                }
            }, 200)
        }, 800)
    }

    handlePrevious () {
        if (this.state.clickTime < Math.floor(Date.now()/1000)) {
            return
        }
        var prev
        const { songs, media, dispatch } = this.props
        for (var i=0; i < songs.length; i++) {
            if ((songs[i].file) === media) {
                prev = (i === 0) ? songs[songs.length - 1] : songs[--i].file
                dispatch(playMedia(prev, this.mediaPlayer.current))
                break
            }
        }
    }

    handleNext () {
        if (this.state.clickTime < Math.floor(Date.now()/1000)) {
            return
        }
        var next
        const { songs, media, dispatch } = this.props
        for (var i=0; i < songs.length; i++) {
            if ((songs[i].file) === media) {
                next = (i === songs.length - 1) ? next = songs[0] : songs[++i].file
                dispatch(playMedia(next, this.mediaPlayer.current))
                break
            }
        }
    }

    render () {
        const { volume } = this.state
        const { mode, media, dispatch } = this.props
        const mediaName = path.basename(media, path.extname(media))
        ipcRenderer.on("open-file", (event, file) => {
            dispatch(playMedia(file[0], this.mediaPlayer.current))
        })

        ipcRenderer.on("play-media", (event, play) => {
            if (media) {
                this.handlePlay()
            }
        })

        ipcRenderer.on("stop-media", (event, play) => {
            if (media) {
                this.stopMedia()
            }
        })

        return (
            <div className="Control">
                <audio ref={this.mediaPlayer} onTimeUpdate={this.handleTimeUpdate}></audio>
                <div className="sound-option">
                    <img src={shuffleIcon} className="shuffle" />
                    <img src={repeatIcon} className="repeat" onClick={this.handleRepeat} />
                </div>
                <div className="media-indicator">
                    <div className="media-title">
                        <span className={(mode === "Paused")
                            ? "" : "marquee"}>{mediaName}</span>
                    </div>
                    <div className="timer">
                        <div className="timer-count" ref={this.currentTime}>00:00</div>
                        <div className="timer-bar" ref={this.timerBar}>
                            <div className="timer-length" ref={this.timerLength}></div>
                        </div>
                        <div className="timer-count" ref={this.duration}>00:00</div>
                    </div>
                    <div className="rwd-play-stop-fwd">
                        <img src={rewindIcon} className="rwd" onClick={this.handlePrevious}
                            onMouseUp={this.handleClearInterval}
                            onMouseDown={this.handleRewind} />
                        <img src={mode === "Paused" ? playIcon : pauseIcon } className="playpause"
                            onClick={this.handlePlay} />
                        <img src={fastFwdIcon} className="fwd" onClick={this.handleNext}
                            onMouseUp={this.handleClearInterval}
                            onMouseDown={this.handleFastFoward} />
                    </div>
                </div>
                <div className="volume">
                    <img src={soundIcon} className="mute" onClick={this.handleMute} />
                    <input type="range" min="0" max="100" value={volume}
                        className="volume-range" onChange={this.handleVolume} />
                </div>
            </div>
        )
    }
}

Control.propTypes = {
    songs: PropTypes.array,
    media: PropTypes.string,
    mode: PropTypes.string,
    loadMedia: PropTypes.func
}

Control.defaultProps = {
    songs: [],
    media: "",
    mode: "",
    loadMedia: f=>f
}

const mapStateToProps = (state) => ({
    songs: state.media.library,
    media: state.media.current,
    mode: state.media.mode
})

export default connect(mapStateToProps)(Control)
