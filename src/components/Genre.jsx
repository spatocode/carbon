import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const Genre = ({ tab="All", songs=[] }) => {
    if (tab === "Genre") {
        return (
            <div className="tab-view" id="Genre">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Genre</th>
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

Genre.propTypes = {
    tab: PropTypes.string
}

const mapStateToProps = (state) => ({
    tab: state.view.tab
})

export default connect(mapStateToProps, null)(Genre)
