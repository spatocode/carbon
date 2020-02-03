import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import All from "./All"
import Artist from "./Artist"
import Album from "./Album"
import Genre from "./Genre"
import "./stylesheets/Music.scss"

const Music = ({ songs=[] }) => {
    return (
        <div className="View">
            <div className="music">
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
    song: PropTypes.array
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Music)
