import React from "react"
import { connect } from "react-redux"
import { appIcon } from "../assets/staticbase64"
import "./stylesheets/NowPlaying.scss"
const mm = window.require("music-metadata")

var cache = {}

const NowPlaying = ({ media="", mode="Paused" }) => {
    const albumArt = React.createRef()
    let url
    if (media) {
        if (cache.data && cache.data.file === media) {
            url = cache.data.url
            initImage(url, function () {
                try {
                    albumArt.current.style.backgroundImage = `linear-gradient(rgba(13, 13, 17, 0.7), rgba(13, 13, 17, 0.7)), url("${url}")`
                }
                catch (e) {}
            })
        }
        else {
            mm.parseFile(media)
                .then((data) => {
                    // TODO: handle metadata of streamed media
                    let picture = data.common.picture
                    if (picture) {
                        picture = picture[0]
                        url = `data:${picture.format};base64,${picture.data.toString("base64")}`
                        cache.data = { file: media, url: url }
                        initImage(url, function () {
                            try {
                                albumArt.current.style.backgroundImage = `linear-gradient(rgba(13, 13, 17, 0.7), rgba(13, 13, 17, 0.7)), url("${url}")`
                            }
                            catch (e) {}
                        })
                    } else {
                        url = `data:image/png;base64,${appIcon}`
                        cache.data = { file: media, url: url }
                        initImage(url, function () {
                            try {
                                albumArt.current.style.backgroundImage = `linear-gradient(rgba(13, 13, 17, 0.7), rgba(13, 13, 17, 0.7)), url("${url}")`
                            }
                            catch (e) {}
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
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

function initImage (url, load) {
    var img = new Image(1, 1)
    img.src = url
    img.onerror = function (err) {
        console.log("Image error: ", err)
    }
    img.onload = load
}

export default connect(mapStateToProps)(NowPlaying)
