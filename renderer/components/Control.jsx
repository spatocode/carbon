import path from "path"
import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { playMedia, setCurrentMediaMode } from "../actions"
import { setPlayer, getPlayer } from "../utils"
import "./stylesheets/Control.scss"
import * as icon from "../assets/staticbase64"
const { ipcRenderer } = window.require("electron")

class Control extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            clickTime: null,
            repeat: false,
            volume: 100,
            shuffle: false
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
        this.handleShuffle = this.handleShuffle.bind(this)
        this.getImageUrl = this.getImageUrl.bind(this)
    }

    componentDidMount () {
        const { mode, dispatch } = this.props
        setPlayer(this.mediaPlayer.current)

        // This prevents the app from being in playing mode on start,
        // which normally happen when app was quit while on playing mode
        if (mode === "Playing") {
            dispatch(setCurrentMediaMode("Paused"))
        }

        ipcRenderer.on("play-media", (event, arg) => {
            this.handlePlay()
        })

        ipcRenderer.on("stop-media", (event, arg) => {
            this.handleStop()
        })

        ipcRenderer.on("previous-media", (event, arg) => {
            this.handlePrevious()
        })

        ipcRenderer.on("next-media", (event, arg) => {
            this.handleNext()
        })

        ipcRenderer.on("rewind-media", (event, arg) => {
            this.handleRewind()
        })

        ipcRenderer.on("fforward-media", (event, arg) => {
            this.handleFastFoward()
        })

        ipcRenderer.on("repeat-media", (event, arg) => {
            this.handleRepeat()
        })

        ipcRenderer.on("shuffle-media", (event, arg) => {
            this.handleShuffle()
        })
    }

    handlePlay () {
        var mediaPlayer = getPlayer()
        const { media, dispatch } = this.props
        if (this.controlInterval) {
            this.handleClearInterval()
        }

        if (mediaPlayer.paused) {
            dispatch(playMedia(media, mediaPlayer))
        } else {
            mediaPlayer.pause()
            dispatch(setCurrentMediaMode("Paused"))
        }
    }

    handleTimeUpdate () {
        var hourValue, minuteValue, secondValue, durHourValue,
            durMinValue, durSecValue
        var mediaPlayer = getPlayer()
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

    handleShuffle () {
        const { shuffle } = this.state
        this.setState({ shuffle: !shuffle })
    }

    handleMute () {
        var mediaPlayer = getPlayer()
        getPlayer().muted = !mediaPlayer.muted
    }

    handleVolume (e) {
        var mediaPlayer = getPlayer()
        this.setState({ volume: e.currentTarget.value })
        mediaPlayer.volume = e.currentTarget.value / 100
    }

    handleStop () {
        const { dispatch } = this.props
        var mediaPlayer = getPlayer()
        mediaPlayer.pause()
        dispatch(setCurrentMediaMode("Paused"))
        mediaPlayer.currentTime = 0
        clearInterval(this.controlInterval)
    }

    handleClearInterval () {
        const { dispatch } = this.props
        clearTimeout(this.controlTimeout)
        clearInterval(this.controlInterval)
        dispatch(setCurrentMediaMode("Playing"))
    }

    handleFastFoward () {
        const { dispatch } = this.props
        this.setState({ clickTime: Math.floor(Date.now()/1000) })
        var mediaPlayer = getPlayer()
        this.controlTimeout = setTimeout(() => {
            this.controlInterval = setInterval(() => {
                if (mediaPlayer.currentTime >= mediaPlayer.duration - 3) {
                    this.handleStop()
                } else {
                    dispatch(setCurrentMediaMode("Paused"))
                    mediaPlayer.currentTime += 3
                }
            }, 200)
        }, 800)
    }

    handleRewind () {
        this.setState({ clickTime: Math.floor(Date.now()/1000) })
        var mediaPlayer = getPlayer()
        this.controlTimeout = setTimeout(() => {
            this.controlInterval = setInterval(() => {
                if (mediaPlayer.currentTime <= 3) {
                    this.handleStop()
                } else {
                    mediaPlayer.currentTime -= 3
                }
            }, 200)
        }, 800)
    }

    handlePrevious () {
        const { clickTime } = this.state
        // return if we are rewinding
        if (typeof clickTime === "number" &&
            clickTime < Math.floor(Date.now()/1000))
        {
            // allow us to handlePrevious next time
            this.setState({ clickTime: null })
            return
        }
        var prev
        const { songs, media, dispatch } = this.props
        for (var i=0; i < songs.length; i++) {
            if ((songs[i].file) === media) {
                prev = (i === 0) ? songs[songs.length - 1] : songs[--i].file
                dispatch(playMedia(prev, getPlayer()))
                break
            }
        }
    }

    handleNext () {
        const { clickTime } = this.state
        // return if we are fast forwarding
        if (typeof clickTime === "number" &&
            clickTime < Math.floor(Date.now()/1000))
        {
            // allow us to handleNext next time
            this.setState({ clickTime: null })
            return
        }

        var next
        const { shuffle } = this.state
        const { songs, media, dispatch } = this.props
        for (var i=0; i < songs.length; i++) {
            if ((songs[i].file) === media) {
                // If we're at the last song, start afresh
                // else play next song
                if (i === songs.length - 1) {
                    next = songs[0]
                } else if (shuffle) {
                    var rand = this.generateRandomNumber(i, songs.length)
                    next = songs[++rand].file
                } else {
                    next = songs[++i].file
                }
                dispatch(playMedia(next, getPlayer()))
                break
            }
        }
    }

    generateRandomNumber (i, length) {
        let rand = Math.floor(Math.random() * (i + 1))
        // Make sure we don't select an out of bound index
        while (length === rand) {
            rand = Math.floor(Math.random() * (i + 1))
        }
        return rand
    }

    getImageUrl (icon) {
        return `data:image/png;base64,${icon}`
    }

    render () {
        const { volume, repeat, shuffle } = this.state
        const { mode, media, dispatch } = this.props
        const mediaName = path.basename(media, path.extname(media))
        ipcRenderer.on("open-file", (event, file) => {
            dispatch(playMedia(file[0], getPlayer()))
        })

        return (
            <div className="Control">
                <audio ref={this.mediaPlayer} onEnded={this.handleNext}
                    onTimeUpdate={this.handleTimeUpdate}></audio>
                <div className="sound-option">
                    <img className="shuffle" onClick={this.handleShuffle}
                        src={shuffle ? this.getImageUrl(icon.shuffleActive)
                            : this.getImageUrl(icon.shuffle)} />
                    <img className="repeat" onClick={this.handleRepeat}
                        src={repeat ? this.getImageUrl(icon.repeatActive)
                            : this.getImageUrl(icon.repeat)} />
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
                        <img src={this.getImageUrl(icon.backward)} className="rwd"
                            onClick={this.handlePrevious}
                            onMouseUp={this.handleClearInterval}
                            onMouseDown={this.handleRewind} />
                        <img src={mode === "Paused" ? this.getImageUrl(icon.play)
                            : this.getImageUrl(icon.pause) } className="playpause"
                        onClick={this.handlePlay} />
                        <img src={this.getImageUrl(icon.forward)} className="fwd"
                            onClick={this.handleNext}
                            onMouseUp={this.handleClearInterval}
                            onMouseDown={this.handleFastFoward} />
                    </div>
                </div>
                <div className="volume">
                    <img src={this.getImageUrl(icon.volume)} className="mute" onClick={this.handleMute} />
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
    mode: PropTypes.string
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
