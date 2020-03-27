import React from "react"
import { connect } from "react-redux"
import "./stylesheets/NowPlaying.scss"
const mi = window.require("mediainfo-wrapper")

const NowPlaying = ({ media="", mode="Paused" }) => {
    const albumArt = React.createRef()
    let url
    if (media) {
        // TODO: Cache url to reduce load time
        mi({ maxBuffer: Infinity }, media)
            .then((data) => {
                url = `data:${data[0].general.cover_mime.toString()};base64,${data[0].general.cover_data.toString("base64")}`
                var img = new Image(1, 1)
                img.src = url
                img.onerror = function (err) {
                    console.log("Image error: ", err)
                }
                img.onload = function () {
                    console.log("loaded")
                    albumArt.current.style.backgroundImage = `linear-gradient(rgba(13, 13, 17, 0.7), rgba(13, 13, 17, 0.7)), url("${url}")`
                }
            })
            .finally(() => { console.log(url) })
            .catch(() => {
                // TODO: Fallback to a default Carbon Media Player icon
            })
    }
    return (
        <div className="now-playing">
            <div ref={albumArt}className="album-art">
                <div className="lyric"></div>
            </div>
        </div>
    )
}

NowPlaying.propTypes = {

}

const mapStateToProps = (state) => ({
    media: state.media.current,
    mode: state.media.mode
})

export default connect(mapStateToProps)(NowPlaying)
