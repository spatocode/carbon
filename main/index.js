const os = require("os")
const path = require("path")
const { app, BrowserWindow, ipcMain } = require("electron")
const mi = require("mediainfo-wrapper")
const buildMenu = require("./menu")

let window

const createWindow = () => {
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

    window.loadURL("http://localhost:3000")

    buildMenu(window)

    window.on("closed", () => {
        window = null
    })

    window.webContents.on("dom-ready", () => {
        window.show()
    })

    fetchMedia()
}

function fetchMedia () {
    const homeDir = os.homedir()
    const musicDir = path.join(homeDir, "Music")
    const downloadsDir = path.join(homeDir, "Downloads")
    const videosDir = path.join(homeDir, "Videos")
    const dirs = [musicDir, videosDir, downloadsDir]

    ipcMain.on("should-update", (event, arg) => {
        if (arg) {
            extractMediaInfo(musicDir)
        }
    })
}

function extractMediaInfo (musicDir) {
    var files = []
    mi({ maxBuffer: Infinity }, musicDir+"/*.mp3")
        .then((data) => {
            for (const i in data) {
                files.push({
                    file: data[i].file,
                    file_name: data[i].general.file_name,
                    file_size: data[i].general.file_size,
                    duration: data[i].general.duration,
                    title: data[i].general.title,
                    album: data[i].general.album,
                    artist: data[i].general.performer,
                    genre: data[i].general.genre,
                    date: data[i].general.recorded_date,
                    cover_mime: data[i].general.cover_mime
                    // cover_data: data[i].general.cover_data
                })
            }
        })
        .finally(() => {
            window.webContents.send("update-library", files)
            console.log("DONE")
        })
        .catch((err) => console.log(err))
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
