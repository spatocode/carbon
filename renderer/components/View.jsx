import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Music from "./Music"
import Downloads from "./Downloads"
import NowPlaying from "./NowPlaying"
import "./stylesheets/View.scss"

const View = ({ view="Now Playing", songs=[], playists=[] }) => {
    switch (view) {
    case "Music":
        return <Music songs={songs}/>
    case "Downloads":
        return <Downloads />
    case "Favourite":
        return <Music />
    case "Now Playing":
        return <NowPlaying />
    }

    for (var i=0; i < playists.length; i++) {
        if (view.includes(playists[i][0])) {
            var playist = songs.filter(song => playists[i].includes(song.file))
            return <Music songs={playist}/>
        }
    }
}

View.propTypes = {
    view: PropTypes.string,
    songs: PropTypes.array,
    playists: PropTypes.array
}

const mapStateToProps = (state) => ({
    view: state.view.category,
    songs: state.media.library,
    playists: state.media.playists
})

export default connect(mapStateToProps, null)(View)
