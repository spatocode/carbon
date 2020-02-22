import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const Artist = ({ tab="All", songs=[] }) => {
    if (tab === "Artist") {
        console.log(tab)
        return (
            <div className="tab-view" id="Artist">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Artist</th>
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

Artist.propTypes = {
    tab: PropTypes.string
}

const mapStateToProps = (state) => ({
    tab: state.view.tab
})

export default connect(mapStateToProps, null)(Artist)
