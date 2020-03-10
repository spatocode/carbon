import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Music from "./Music"
import Video from "./Video"
import Downloads from "./Downloads"
import Settings from "./Settings"
import Playists from "./Playists"
import NowPlaying from "./NowPlaying"
import "./stylesheets/View.scss"

const View = ({ view="Now Playing", songs=[] }) => {
    switch (view) {
    case "Music":
        return <Music songs={songs}/>
    case "Video":
        return <Video />
    case "Downloads":
        return <Downloads />
    case "Settings":
        return <Settings />
    case "Playists":
        return <Playists />
    case "Favourite":
        return <Music />
    default:
        return <NowPlaying />
    }
}

View.propTypes = {
    view: PropTypes.string,
    songs: PropTypes.array
}

const mapStateToProps = (state) => ({
    view: state.view.category,
    songs: state.media.library
})

export default connect(mapStateToProps, null)(View)
