import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { selectTab } from "../actions"
import All from "./All"
import Artist from "./Artist"
import Album from "./Album"
import Genre from "./Genre"
import "./stylesheets/Music.scss"

const Music = ({ tab="All", selectTab=f=>f }) => {
    var tabStyle = { borderBottom: "2.5px solid rgb(223, 196, 196)" }
    var titles = ["All", "Artist", "Album", "Genre"]
    return (
        <div className="View">
            <div className="music">
                <Tab tabStyle={tabStyle} titles={titles} />
                <div className="tab-content">
                    <All />
                    <Artist />
                    <Album />
                    <Genre />
                </div>
            </div>
        </div>
    )
}

Music.propTypes = {
    tab: PropTypes.string,
    selectTab: PropTypes.func
}

const mapStateToProps = (state) => ({
    tab: state.view.tab
})

const mapDispatchToProps = (dispatch) => ({
    selectTab: (e) => dispatch(selectTab(e.currentTarget.innerText))
})

export default connect(mapStateToProps, mapDispatchToProps)(Music)
