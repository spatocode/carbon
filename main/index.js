const os = require("os")
const path = require("path")
const { app, BrowserWindow, ipcMain } = require("electron")
const mm = require("music-metadata")
const klawSync = require("klaw-sync")
const buildMenu = require("./menu")

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
    app.quit()
}

let window

const createWindow = () => {
    window = new BrowserWindow({
        title: "Carbon Media Player",
        show: false,
        width: 860,
        height: 500,
        useContentSize: true,
        minHeight: 500,
        minWidth: 860,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "/preload.js")
        }
    })

    window.loadURL("http://localhost:3000")
    // window.loadFile(path.join(__dirname, "../renderer/build/index.html"))

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

async function extractMediaInfo (musicDir) {
    var metadata = []

    // ignore hidden folders and non-mp3 files
    const filterFunc = item => {
        const basename = path.basename(item.path)
        return basename === "." || basename[0] !== "." || (!item.stat.isDirectory() && path.extname(basename) !== ".mp3")
    }

    var files = klawSync(musicDir, { nodir: true, filter: filterFunc })
    for (const file of files) {
        var filepath = file.path
        await mm.parseFile(filepath)
            .then((data) => {
                var dur
                const common = data.common
                const format = data.format
                if (format.duration) {
                    dur = `${Math.floor(format.duration/60)}:${Math.floor(format.duration%60)}`
                } else {
                    dur = "00:00"
                }
                metadata.push({
                    file: filepath,
                    file_name: path.basename(filepath, path.extname(filepath)),
                    artist: common.artist,
                    title: common.title,
                    album: common.album,
                    genre: common.genre,
                    duration: dur,
                    year: common.year,
                    track: common.track.no,
                    lyrics: common.lyrics
                })
                console.log(filepath)
            })
            .catch(err => console.error("ERROR:", err.message))
    }
    window.webContents.send("update-library", metadata)
    console.log("DONE")
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
