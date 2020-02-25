import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Music from "./Music"
import Favourite from "./Favourite"
import Video from "./Video"
import Downloads from "./Downloads"
import Settings from "./Settings"
import Playists from "./Playists"
import NowPlaying from "./NowPlaying"
import "./stylesheets/View.scss"

const View = ({ view="Now Playing" }) => {
    switch (view) {
    case "Music":
        return <Music />
    case "Video":
        return <Video />
    case "Downloads":
        return <Downloads />
    case "Settings":
        return <Settings />
    case "Playists":
        return <Playists />
    case "Favourite":
        return <Favourite />
    default:
        return <NowPlaying />
    }
}

View.propTypes = {
    view: PropTypes.string
}

const mapStateToProps = (state) => ({
    view: state.view.category
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(View)
