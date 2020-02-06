import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const Album = ({ tab="All", songs=[] }) => {
    if (tab === "Album") {
        return (
            <div className="tab-view" id="Album">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Album</th>
                            <th>Artist</th>
                            <th>Genre</th>
                            <th>Release year</th>
                            <th>Count</th>
                            <th>Length</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    return null
}

Album.propTypes = {
    tab: PropTypes.string
}

const mapStateToProps = (state) => ({
    tab: state.view.tab
})

export default connect(mapStateToProps, null)(Album)
