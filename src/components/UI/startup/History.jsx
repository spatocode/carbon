import React, { Component } from "react"
import CallHistory from "./CallHistory"

class History extends Component {
  constructor() {
    super()
    this.state = {
      view: "all"
    }

    this.openAll = this.openAll.bind(this)
    this.openMissed = this.openMissed.bind(this)
    this.openDialled = this.openDialled.bind(this)
    this.openReceived = this.openReceived.bind(this)
  }

  openAll() {
    this.setState({ view: "all" })
  }

  openDialled() {
    this.setState({ view: "dialled" })
  }

  openReceived() {
    this.setState({ view: "received" })
  }

  openMissed() {
    this.setState({ view: "missed" })
  }

  render() {
    const { view } = this.state
    const tabStyle = {
      border: "1px solid grey",
      padding: "10px",
      paddingRight: "30px",
      paddingLeft: "30px",
      color: "blue"
    }
    return (
      <div className="container">
        <div className="container">
          <div className="container">
            <div style={ styles.menuSub }>
              <span style={ (view === "all") ? tabStyle : styles.menu } onClick={ this.openAll }>All</span>
              <span style={ (view === "dialled") ? tabStyle : styles.menu } onClick={ this.openDialled }>Dialled</span>
              <span style={ (view === "received") ? tabStyle : styles.menu } onClick={ this.openReceived }>Received</span>
              <span style={ (view === "missed") ? tabStyle : styles.menu } onClick={ this.openMissed }>Missed</span>
            </div>
            <div style={ styles.callHistory }>
              <CallHistory view={ view } />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  menuSub: {
  },
  menu: {
    padding: "10px",
    paddingRight: "30px",
    paddingLeft: "30px",
    color: "blue"
  },
  callHistory: {
    marginTop: "8px",
    marginBottom: "8px",
    borderTop: "1px solid grey"
  }
}

export default History
