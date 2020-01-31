import React from "react"
import profilePic from "../../../assets/profile-pic.jpg"

const Welcome = () => {
  return (
    <div style={styles.welcome}>
      <div style={styles.greetings}>
        <h1>Welcome, Ekene</h1>
      </div>
      <div>
        <img src={ profilePic }  alt="profile-pic" style={ styles.profilePic } 
          width="130" height="130" />
      </div>
      <div style={ styles.editProfileSub }>
        <span style={ styles.editProfile }>Edit profile</span>
      </div>
      <div>
        <span style={ styles.status }>Hey, this is a dummy account</span>
      </div>
      <div style={ styles.startChatSub }>
        <span style={ styles.startChat }>Start a conversation</span>
      </div>
      <div style={ styles.logoutSub }>
        <span>Not you? </span>
        <span style={ styles.logout }>Logout</span>
      </div>
    </div>
  )
}

const styles = {
  welcome: {
    textAlign: "center",
    marginTop: "50px"
  },
  greetings: {
    marginBottom: "40px"
  },
  profilePic: {
    borderRadius: 100
  },
  editProfileSub: {
    marginTop: "20px",
    marginBottom: "20px"
  },
  editProfile: {
    textDecoration: "underline",
    cursor: "pointer",
  },
  status: {
    fontSize: "17px"
  },
  startChatSub: {
    marginTop: "40px",
    marginBottom: "30px"
  },
  startChat: {
    padding: "8px 30px 8px 30px",
    borderRadius: 100,
    backgroundColor: "rgb(22, 6, 58)",
    color: "whitesmoke",
    cursor: "pointer"
  },
  logoutSub: {
    marginTop: "100px",
    fontWeight: "bold"
  },
  logout: {
    textDecoration: "underline",
    cursor: "pointer"
  }
}

export default Welcome
