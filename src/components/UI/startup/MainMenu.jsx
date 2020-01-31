import React from "react"
import startUp from "./startUp.css"
// import { shell } from "electron"
import profilePic from "../../../assets/profile-pic.jpg"
import { version, name, url } from "../../../../package.json"


const Menu = ({ openView=f=>f }) => {
  const goToURL = (event) => {
    event.preventDefault()
    // shell.openExternal(url)
  }

  return (
    <div className="main-menu" style={ styles.mainMenu }>
      <div style={ styles.profile } className="profile">
        <img src={ profilePic }  alt="profile-pic" style={ styles.profilePic } 
          width="90" height="90" />
        <h1 style={ styles.username }>spatocode</h1>
      </div>
      <div>
        <ul style={ styles.menuUList }>
          <li style={ styles.menuList } onClick={openView}>Calls</li>
          <li style={ styles.menuList } onClick={openView}>Videos</li>
          <li style={ styles.menuList } onClick={openView}>Chats</li>
          <li style={ styles.menuList } onClick={openView}>Contacts</li>
          <li style={ styles.menuList } onClick={openView}>Notifications</li>
          <li style={ styles.menuList } onClick={openView}>Settings</li>
          <li style={ styles.menuList } onClick={openView}>Night mode</li>
        </ul>
      </div>
      <div style={styles.about}>
        <div><b>{ name.replace("-", " ") }</b></div>
        <div>Version { version }</div>
        <div><a href="#" onClick={ goToURL }>About</a></div>
      </div>
    </div>
  )
}

const styles = {
  mainMenu: {
    backgroundColor: "rgb(22, 6, 58, 0.3)",
    color: "rgb(46, 46, 46)",
    width: "230px",
    borderRight: "1px solid grey"
  },
  profile: {
    padding: "20px",
    textAlign: "center"
  },
  profilePic: {
    borderRadius: 100
  },
  username: {
    fontSize: "25px"
  },
  menuUList: {
    listStyleType: "none",
    fontWeight: "100",
    fontSize: "15px",
    fontFamily: "arial",
    color: "black",
    margin: 0,
    padding: 0,
  },
  menuList: {
    display: "block",
    padding: "8px 10px 8px 40px",
    backgroundColor: ""
  },
  about: {
    textAlign: "center",
    fontSize: "14px",
    marginTop: "50px",
    marginBottom: "20px"
  }
}

export default Menu
