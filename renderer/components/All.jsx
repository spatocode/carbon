import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import "./stylesheets/All.scss"
const path = window.require("path")

const All = ({ tab="All", songs=[] }) => {
    if (tab === "All") {
        return (
            <div className="tab-view" id="All">
                <table className="">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Length</th>
                            <th>Rating</th>
                            <th>Artist</th>
                            <th>Album</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song, i) =>
                            <tr key={i}>
                                <td>{i}</td>
                                <td>{path.basename(song.path, path.extname(song.path))}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
    return null
}

All.propTypes = {
    tab: PropTypes.string,
    songs: PropTypes.array
}

const mapStateToProps = (state) => ({
    tab: state.view.tab,
    songs: state.media.library
})

export default connect(mapStateToProps, null)(All)
