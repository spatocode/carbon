import React from "react"
import Welcome from "./Welcome"
import Calls from "../calls/Calls"
import Videos from "../videos/Videos"

const View = ({ view }) => {
  console.log(view)
  switch (view) {
    case "Calls":
      return <div className="container"><Calls /></div>
    default:
      return <div className="container"><Welcome /></div>
  }
}

export default View
