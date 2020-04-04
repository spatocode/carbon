import React from "react"
import { connect } from "react-redux"
import "./stylesheets/Tab.scss"

const Tab = ({ tabView="", selectTab=f=>f, titles=[] }) => {
    const handleView = (e) => {
        selectTab(e)
    }
    return (
        <div className="Tab">
            {titles.map((title, i) =>
                <div key={i} className="tab-item" onClick={handleView}
                    style={tabView===title
                        ? { borderBottom: "3px solid rgb(175, 174, 174)" } : null}>
                    {title}
                </div>
            )}
        </div>
    )
}

Tab.propTypes = {

}

const mapStateToProps = (state) => ({
    tab: state.view.tab
})

export default connect(mapStateToProps)(Tab)
