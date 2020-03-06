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
        this.handlePlay = this.handlePlay.bind(this)
        this.setupMediaSrc = this.setupMediaSrc.bind(this)
    }

    setupMediaSrc (filepath, mediaPlayer) {
        if (!MediaSource.isTypeSupported("audio/mpeg")) {
            console.log("Codec not supported")
            return
        }
        mediaPlayer = mediaPlayer.current
        var mediaSrc = new MediaSource()

        mediaSrc.addEventListener("sourceopen", function () {
            console.log(mediaSrc.readyState)
            var sourceBuffer = mediaSrc.addSourceBuffer("audio/mpeg")
            fetchMedia(filepath, function (buffer) {
                sourceBuffer.addEventListener("updateend", function () {
                    console.log("updateend")
                    mediaSrc.endOfStream()
                    console.log("endofstream")
                    mediaPlayer.play()
                        .then(function () {
                            console.log("Fufilled")
                        }).catch(function (err) {
                            console.log("Rejected with error: ", err)
                        })
                    console.log("play")
                    console.log(mediaPlayer)
                })
                console.log("append")
                sourceBuffer.appendBuffer(buffer)
            })
        })

        mediaPlayer.src = window.URL.createObjectURL(mediaSrc)
        mediaPlayer.setAttribute("crossorigin", "anonymous")
        console.log(mediaPlayer)
        console.log(mediaSrc.readyState)
    }

    handlePlay () {
        console.log(this.mediaPlayer.current)
        this.mediaPlayer.current.play()
    }

    handleTimeUpdate () {

    }

    render () {
        const { media, loadFile } = this.props
        const mediaName = path.basename(media, path.extname(media))

        if (media) {
            this.setupMediaSrc(media, this.mediaPlayer)
        }

        ipcRenderer.on("open-file", (event, file) => {
            loadFile(file[0])
        })

        return (
            <div className="Control">
                <audio ref={ this.mediaPlayer } onTimeUpdate={this.handleTimeUpdate}></audio>
                <div className="sound-option">
                    <span className="shuffle"></span>
                    <span className="repeat"></span>
                </div>
                <div className="media-indicator">
                    <div className="song-title">{mediaName}</div>
                    <div className="timer">
                        <div className="timer-count">00:00</div>
                        <div className="timer-bar">
                            <div className="timer-length"></div>
                        </div>
                        <div className="timer-count">-04:32</div>
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

function fetchMedia (url, loadMedia) {
    console.log(url)
    var xhr = new XMLHttpRequest()
    xhr.open("get", url)
    xhr.onerror = function () {
        console.log("Error fetching media")
    }
    xhr.responseType = "arraybuffer"
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
    xhr.onload = function () {
        console.log("Loading...")
        loadMedia(xhr.response)
    }
    xhr.send()
}

Control.propTypes = {
    media: PropTypes.string,
    loadFile: PropTypes.func
}

Control.defaultProps = {
    media: "",
    loadFile: f=>f
}

const mapStateToProps = (state) => ({
    media: state.media.current
})

const mapDispatchToProps = (dispatch) => ({
    loadFile: (file) => dispatch(playMedia(file)),
    onPlay: () => {}
})

export default connect(mapStateToProps, mapDispatchToProps)(Control)
