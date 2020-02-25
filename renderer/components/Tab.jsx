import React from "react"
import { connect } from "react-redux"
import { selectTab } from "../actions"

const Tab = ({ tab="", selectTab=f=>f, titles=[], tabStyle={} }) => {
    return (
        <div className="tab">
            {titles.map((title, i) =>
                <div key={i} className="tab-item" onClick={selectTab} style={tab==="All" ? tabStyle : null}>{title}</div>
            )}
        </div>
    )
}

Tab.propTypes = {

}

const mapStateToProps = (state) => ({
    tab: state.view.tab
})

const mapDispatchToProps = (dispatch) => ({
    selectTab: (e) => dispatch(selectTab(e.currentTarget.innerText))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tab)
