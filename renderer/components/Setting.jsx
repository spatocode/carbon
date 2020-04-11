import React from "react"
import { connect } from "react-redux"
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
        const { height } = this.state
        const visibility = ["Artist", "Title", "Track", "Play count",
            "Length", "Location", "Album", "Year", "Genre", "Quality",
            "Comment"]
        return (
            <div className="Setting" style={{ height: height }}>
                <div className="tab-view">
                    <MusicSetting visibility={visibility} />
                </div>
            </div>
        )
    }
}

export default connect()(Setting)
