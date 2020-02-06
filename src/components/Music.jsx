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
    return (
        <div className="View">
            <div className="music">
                <div className="tab">
                    <div className="tab-item" onClick={selectTab}>All</div>
                    <div className="tab-item" onClick={selectTab}>Artist</div>
                    <div className="tab-item" onClick={selectTab}>Album</div>
                    <div className="tab-item" onClick={selectTab}>Genre</div>
                </div>
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
