import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const All = ({ tab="All", songs=[] }) => {
    if (tab === "All") {
        return (
            <div className="tab-view" id="All">
                <table className="table table-bordered">
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

All.propTypes = {
    tab: PropTypes.string
}

const mapStateToProps = (state) => ({
    tab: state.view.tab
})

export default connect(mapStateToProps, null)(All)
