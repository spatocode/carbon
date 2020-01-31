const { app, BrowserWindow } = require("electron")

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
  app.quit()
}

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 630
  })

  mainWindow.loadURL("http://localhost:3000")

  mainWindow.on("closed", () => {
    mainWindow = null
  })

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.show()
  })
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})
