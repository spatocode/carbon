import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Music from "./Music"
import NowPlaying from "./NowPlaying"
import Setting from "./Setting"
import "./stylesheets/View.scss"

const View = ({ view="Now Playing", songs=[], playlists=[] }) => {
    switch (view) {
    case "Music":
        return <Music songs={songs}/>
    case "Favourite":
        return <Music />
    case "Now Playing":
        return <NowPlaying />
    case "Setting":
        return <Setting />
    }

    // Check if we opened playlist view
    for (var i=0; i < playlists.length; i++) {
        if (view.includes(playlists[i][0])) {
            // separate playlist name from playlist items
            var playlist = playlists[i].concat()
            playlist.shift()
            return <Music playlist={playlist}/>
        }
    }
    return <NowPlaying />
}

View.propTypes = {
    view: PropTypes.string,
    songs: PropTypes.array,
    playlists: PropTypes.array
}

const mapStateToProps = (state) => ({
    view: state.view.category,
    songs: state.media.library,
    playlists: state.media.playlists
})

export default connect(mapStateToProps, null)(View)
