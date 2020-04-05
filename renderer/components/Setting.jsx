import React from "react"
// import PropTypes from "prop-types"
import { connect } from "react-redux"
import Tab from "./Tab"
import GeneralSetting from "./GeneralSetting"
import MusicSetting from "./MusicSetting"
import "./stylesheets/Setting.scss"

class Setting extends React.Component {
    constructor (props) {
        super(props)
        this.selectTab = this.selectTab.bind(this)
        this.state = {
            tabView: "General",
            height: window.innerHeight - 142
        }
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount () {
        window.onresize = this.handleResize
    }

    componentWillUnmount () {
        window.onresize = null
    }

    handleResize () {
        this.setState({ height: window.innerHeight - 142 })
    }

    selectTab (e) {
        this.setState({ tabView: e.currentTarget.innerText })
    }

    render () {
        const { tabView, height } = this.state
        const tabTitles = ["General", "Music"]
        const visibility = ["Artist", "Title", "Rating", "Track",
            "Composer", "Play count", "Length", "Date added",
            "Location", "Last played", "Album", "Year", "Genre",
            "Quality", "Comment"]
        const themes = ["Carbon", "Ola-edo", "Onyinye", "Cherokee"]
        const lyricsFont = ["Arial", "sans-seriff", "Helvetica"]
        return (
            <div className="Setting" style={{ height: height }}>
                <Tab titles={tabTitles} selectTab={this.selectTab}
                    tabView={tabView} />
                <div className="tab-view">
                    {
                        tabView === "General"
                            ? <GeneralSetting themes={themes} lyricsFont={lyricsFont} />
                            : <MusicSetting visibility={visibility} />
                    }
                </div>
            </div>
        )
    }
}

Setting.propTypes = {

}

Setting.defaultProps = {

}

export default connect()(Setting)
