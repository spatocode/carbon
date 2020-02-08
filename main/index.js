const path = require("path")
const { app, BrowserWindow } = require("electron")
const buildMenu = require("./menu")

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
    app.quit()
}

let window

const createWindow = () => {
    const url = process.env.ELECTRON_ENV === "development"
        ? path.join(__dirname, "/../build/index.html") : "http://localhost:3000"

    window = new BrowserWindow({
        title: "Carbon Media Player",
        show: false,
        width: 1000,
        height: 600,
        useContentSize: true,
        minHeight: 400,
        minWidth: 800,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "/preload.js")
        }
    })

    window.loadURL(url)

    buildMenu(window)

    window.on("closed", () => {
        window = null
    })

    window.webContents.on("dom-ready", () => {
        window.show()
    })
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (window === null) {
        createWindow()
    }
})
