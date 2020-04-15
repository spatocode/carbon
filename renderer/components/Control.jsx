import path from "path"
import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { playMedia, setCurrentMediaMode, updateVisibleColumn } from "../actions"
import { setPlayer, getPlayer } from "../utils"
import "./stylesheets/Control.scss"
import * as icon from "../assets/staticbase64"
const { ipcRenderer } = window.require("electron")
const Store = window.require("electron-store")

class Control extends React.Component {
    constructor (props) {
        const store = new Store()
        super(props)
        const repeat = store.get("control.repeat")
        const shuffle = store.get("control.shuffle")
        const volume = store.get("control.volume")
        const playbackrate = store.get("control.playbackrate")
        this.state = {
            progress: 0,
            clickTime: null,
            repeat: repeat,
            volume: volume,
            shuffle: shuffle,
            playbackrate: playbackrate
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
        this.handleSeek = this.handleSeek.bind(this)
        this.persistData = this.persistData.bind(this)
        this.handlePlaybackRate = this.handlePlaybackRate.bind(this)
        this.nameToPlaybackRate = this.nameToPlaybackRate.bind(this)
    }

    componentDidMount () {
        const { volume } = this.state
        const { media, mode, dispatch } = this.props
        const mediaPlayer = this.mediaPlayer.current
        mediaPlayer.volume = volume / 100
        // Stores the audio player in memory to be used from all modules
        setPlayer(mediaPlayer)

        // This prevents the app from being in playing mode on start,
        // which normally happen when app was quit while on playing mode
        if (mode === "Playing") {
            dispatch(setCurrentMediaMode("Paused"))
        }

        if (media) {
            const { dispatch } = this.props
            const player = getPlayer()
            ipcRenderer.on("control", (event, action) => {
                switch (action) {
                case "playpause":
                    this.handlePlay()
                    break
                case "stop-media":
                    this.handleStop()
                    break
                case "previous-media":
                    this.handlePrevious()
                    break
                case "next-media":
                    this.handleNext()
                    break
                case "rewind-media":
                    this.handleRewind()
                    break
                case "fforward-media":
                    this.handleFastFoward()
                    break
                case "repeat-media":
                    this.this.handleRepeat()
                    break
                case "shuffle-media":
                    this.handleShuffle()
                    break
                default:
                    dispatch(playMedia(action, player))
                }
            })

            ipcRenderer.on("volume", (event, action) => {
                switch (action) {
                case "increase":
                    this.handleVolume(null, true)
                    break
                case "decrease":
                    this.handleVolume(null, false)
                    break
                case "mute":
                    this.handleMute()
                    break
                }
            })

            ipcRenderer.on("playbackrate", (event, action) => {
                const rate = this.nameToPlaybackRate(action)
                this.handlePlaybackRate(rate, function () {
                    this.persistData("control.playbackrate", action)
                })
            })
        }

        ipcRenderer.on("toggle-visible-column", (event, action) => {
            const obj = {}
            obj[`${action[0].toLowerCase()}`] = action[1]
            dispatch(updateVisibleColumn(obj))
        })
    }

    nameToPlaybackRate (name) {
        switch (name) {
        case "Very Slow":
            return 0.4
        case "Slower":
            return 0.6
        case "Slow":
            return 0.8
        case "Normal":
            return 1
        case "Fast":
            return 1.2
        case "Faster":
            return 1.4
        case "Very Fast":
            return 1.6
        default:
            return 1
        }
    }

    persistData (key, value) {
        return new Promise(resolve => {
            if (this.persistTimeout) {
                clearTimeout(this.persistTimeout)
            }
            this.persistTimeout = setTimeout(function () {
                const store = new Store()
                store.set(`${key}`, value)
                return resolve("Saved to local store!!!")
            }, 100)
        })
    }

    /**
     * Play/Pause media
     */
    handlePlay () {
        var mediaPlayer = getPlayer()
        const { playbackrate } = this.state
        const { mode, media, dispatch } = this.props
        if (!media) {
            return
        }
        if (this.controlInterval) {
            this.handleClearInterval()
        }
        if (mode === "Paused") {
            dispatch(playMedia(media, mediaPlayer))
            mediaPlayer.playbackRate = this.nameToPlaybackRate(playbackrate)
            console.log(this.nameToPlaybackRate(playbackrate))
        } else {
            mediaPlayer.pause()
            dispatch(setCurrentMediaMode("Paused"))
        }
    }

    handlePlaybackRate (rate, callback) {
        const { media } = this.props
        if (!media) {
            return
        }
        var mediaPlayer = getPlayer()
        mediaPlayer.playbackRate = rate
        this.setState({ playbackrate: rate })
        callback.call(this)
    }

    /**
     * Updates media timer.
     * This is called when the media is at progress
     */
    async handleTimeUpdate () {
        var hourValue, minuteValue, secondValue, durHourValue,
            durMinValue, durSecValue
        var mediaPlayer = getPlayer()
        var currentTime = this.currentTime.current
        var duration = this.duration.current
        // var timerLength = this.timerLength.current

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
        var length = 100 * (mediaPlayer.currentTime/mediaPlayer.duration) || 0
        currentTime.innerText = mediaTime
        duration.innerText = durationTime
        this.setState({ progress: length })
    }

    /**
     * Update the media timer by seeking
     */
    handleSeek (e) {
        const { progress } = this.state
        const { media } = this.props
        if (!media) {
            return
        }
        const mediaPlayer = getPlayer()
        const value = e.currentTarget.value
        // TODO: enhance calculation to fix bug which can occur when
        // currentTime is 0 while seeking. This causes currentTime
        // to return to value
        mediaPlayer.currentTime = (value * mediaPlayer.currentTime) / progress || 0
        this.setState({ progress: value })
    }

    /**
     * Set media on repeat mode
     */
    handleRepeat () {
        const store = new Store()
        const { repeat } = this.state
        this.mediaPlayer.current.loop = !repeat
        this.setState({ repeat: !repeat })
        store.set("control.repeat", !repeat)
    }

    /**
     * Set media on shuffle mode
     */
    handleShuffle () {
        const store = new Store()
        const { shuffle } = this.state
        this.setState({ shuffle: !shuffle })
        store.set("control.shuffle", !shuffle)
    }

    /**
     * Set media on mute mode
     */
    handleMute () {
        var mediaPlayer = getPlayer()
        getPlayer().muted = !mediaPlayer.muted
    }

    /**
     * Increases/decreases the media volume
     */
    async handleVolume (e, increase) {
        var mediaPlayer = getPlayer()
        // Check if we're calling from the main process native menu
        if (!e) {
            const { volume } = this.state
            if (increase && volume < 100) {
                this.setState({ volume: 100 })
                mediaPlayer.volume = 1
                await this.persistData("control.volume", 100)
            } else if (!increase && volume > 0) {
                this.setState({ volume: 0 })
                mediaPlayer.volume = 0
                await this.persistData("control.volume", 0)
            }
            return
        }
        this.setState({ volume: e.currentTarget.value })
        mediaPlayer.volume = e.currentTarget.value / 100
        await this.persistData("control.volume", e.currentTarget.value)
    }

    /**
     * Stops the media from playing
     */
    handleStop () {
        const { dispatch, media } = this.props
        if (!media) {
            return
        }
        var mediaPlayer = getPlayer()
        mediaPlayer.pause()
        dispatch(setCurrentMediaMode("Paused"))
        mediaPlayer.currentTime = 0
        this.setState({ progress: 0 })
        clearInterval(this.controlInterval)
    }

    /**
     * Clears/Stops any control interval.
     * Control intervals handles media fast-forwards/rewinds
     */
    handleClearInterval () {
        const { dispatch } = this.props
        if (this.controlInterval) {
            clearInterval(this.controlInterval)
            dispatch(setCurrentMediaMode("Playing"))
        }
        clearTimeout(this.controlTimeout)
    }

    /**
     * Fast forwards the media
     */
    handleFastFoward () {
        const { dispatch, media } = this.props
        if (!media) {
            return
        }
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

    /**
     * Rewinds the media
     */
    handleRewind () {
        const { dispatch, media } = this.props
        if (!media) {
            return
        }
        this.setState({ clickTime: Math.floor(Date.now()/1000) })
        var mediaPlayer = getPlayer()
        this.controlTimeout = setTimeout(() => {
            this.controlInterval = setInterval(() => {
                if (mediaPlayer.currentTime <= 3) {
                    this.handleStop()
                } else {
                    dispatch(setCurrentMediaMode("Paused"))
                    mediaPlayer.currentTime -= 3
                }
            }, 200)
        }, 800)
    }

    /**
     * Play the previous song in library
     */
    handlePrevious () {
        var prev
        const { shuffle, clickTime } = this.state
        const { songs, media, dispatch } = this.props
        var mediaPlayer = getPlayer()
        if (!media) {
            return
        }
        // return if we are rewinding
        if (typeof clickTime === "number" &&
            clickTime < Math.floor(Date.now()/1000))
        {
            // allow us to handlePrevious next time
            this.setState({ clickTime: null })
            return
        }

        for (var i=0; i < songs.length; i++) {
            if (songs[i].file === media) {
                if (mediaPlayer.currentTime >= 5) {
                    mediaPlayer.currentTime = 0
                    return
                }
                // If we're at the first song, play the last song
                // else play prev song
                else if (i === 0) {
                    prev = songs[songs.length - 1].file
                } else if (shuffle) {
                    var rand = this.generateRandomNumber(i, songs.length)
                    prev = songs[--rand].file
                } else {
                    prev = songs[--i].file
                }
                dispatch(playMedia(prev, mediaPlayer))
                break
            }
        }
    }

    /**
     * Plays the next song in memory
     */
    handleNext () {
        var next
        const { shuffle, clickTime } = this.state
        const { songs, media, dispatch } = this.props
        if (!media) {
            return
        }
        // return if we are fast forwarding
        if (typeof clickTime === "number" &&
            clickTime < Math.floor(Date.now()/1000))
        {
            // allow us to handleNext next time
            this.setState({ clickTime: null })
            return
        }

        for (var i=0; i < songs.length; i++) {
            if (songs[i].file === media) {
                // If we're at the last song, start afresh
                // else play next song
                if (i === songs.length - 1) {
                    next = songs[0].file
                } else if (shuffle) {
                    console.log("shufffle", shuffle)
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

    /**
     * Generates random number for media shuffle
     */
    generateRandomNumber (i, length) {
        let rand = Math.floor(Math.random() * length-1) + 1
        // Make sure we don't select an out of bound index
        // Just a cautious check anyway
        while (rand === length) {
            console.log("BAD RAND", rand)
            rand = Math.floor(Math.random() * length-1) + 1
        }
        console.log("GOOD RAND", rand)
        return rand
    }

    /**
     * Returns the image url.
     * This is used in setting the image src
     * @param {icon} string `The base64 encoding of the image to use`
     */
    getImageUrl (icon) {
        return `data:image/png;base64,${icon}`
    }

    render () {
        const { volume, repeat, shuffle, progress } = this.state
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
                        <span>{mediaName}</span>
                    </div>
                    <div className="timer">
                        <div className="timer-count" ref={this.currentTime}>00:00</div>
                        <input disabled={!media} type="range" min="0" max="100" value={progress}
                            className="timer-length"
                            onChange={this.handleSeek} />
                        <div className="timer-count" ref={this.duration}>00:00</div>
                    </div>
                    <div className="rwd-play-stop-fwd">
                        <img src={this.getImageUrl(icon.backward)} className="rwd"
                            onClick={this.handlePrevious}
                            onMouseUp={this.handleClearInterval}
                            onMouseDown={this.handleRewind} />
                        <img src={mode === "Playing" ? this.getImageUrl(icon.pause)
                            : this.getImageUrl(icon.play) } className="playpause"
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
