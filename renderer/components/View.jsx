import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Music from "./Music"
import Favourite from "./Favourite"
import Video from "./Video"
import Downloads from "./Downloads"
import Setting from "./Setting"
import Playist from "./Playist"
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
    case "Setting":
        return <Setting />
    case "Playist":
        return <Playist />
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
