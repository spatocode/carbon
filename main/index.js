const path = require("path")
const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron")
const Store = require("electron-store")
const isDev = require("electron-is-dev")
const mm = require("music-metadata")
const klawSync = require("klaw-sync")
const buildMenu = require("./menu")
const checkForUpdates = require("./updater")

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
    app.quit()
}

let window
let updateInterval

const createWindow = () => {
    window = new BrowserWindow({
        title: "Carbon Player",
        show: false,
        width: 860,
        height: 500,
        useContentSize: true,
        minHeight: 500,
        minWidth: 860,
        backgroundColor: "#bebdbd",
        icon: path.join(__dirname, "../icons/64x64.png"),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "/preload.js")
        }
    })

    window.loadFile(path.join(__dirname, "../renderer/build/index.html"))

    initStore()
    buildMenu(window)
    registerShortcuts()

    window.on("closed", () => {
        window = null
    })

    window.on("maximize", () => {
        window.webContents.send("maximize", true)
    })

    window.on("unmaximize", () => {
        window.webContents.send("maximize", false)
    })

    window.webContents.on("dom-ready", () => {
        window.show()
    })
    fetchMedia()

    if (!isDev) {
        updateInterval = checkForUpdates()
    }
}

function registerShortcuts () {
    globalShortcut.register("MediaPlayPause", () => {
        window.webContents.send("control", "playpause")
    })

    globalShortcut.register("MediaStop", () => {
        window.webContents.send("control", "stop-media")
    })

    globalShortcut.register("MediaPreviousTrack", () => {
        window.webContents.send("control", "previous-media")
    })

    globalShortcut.register("MediaNextTrack", () => {
        window.webContents.send("control", "next-media")
    })
}

function initStore () {
    const defaults = {
        control: {
            repeat: false,
            shuffle: false,
            volume: 100,
            playbackrate: "Normal"
        },
        state: {
            media: {
                library: [],
                favourite: [],
                playlists: [],
                recent: [],
                current: "",
                source: ""
            }
        }
    }
    const store = new Store({ defaults: defaults })
    const musicDir = app.getPath("music")
    const downloadsDir = app.getPath("downloads")
    const visibleColumn = {
        track: true,
        title: true,
        artist: true,
        length: true,
        album: true,
        genre: true,
        // rating: false,
        composer: false,
        "date added": false,
        location: false,
        year: false,
        quality: false,
        comment: false
    }

    if (!store.has("libLocation")) {
        store.set("libLocation", [musicDir, downloadsDir])
    }

    if (!store.has("state.settings.visibleColumn")) {
        store.set("state.settings.visibleColumn", visibleColumn)
    }
}

function fetchMedia () {
    const store = new Store()
    const dirs = store.get("libLocation")

    ipcMain.on("should-update", (event, arg) => {
        if (arg) {
            extractMediaInfo(dirs)
        }
    })
}

async function extractMediaInfo (dirs) {
    const store = new Store()
    const metadata = []
    let files = []

    // ignore hidden folders and non-mp3 files
    const filterFunc = item => {
        const basename = path.basename(item.path)
        return path.extname(basename) === ".mp3" || path.extname(basename) === ".MP3" || (item.stats.isDirectory() && basename[0] !== ".")
    }

    for (var i=0; i < dirs.length; i++) {
        const dirFiles = klawSync(dirs[i], { nodir: true, filter: filterFunc })
        files = files.concat(dirFiles)
    }

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
                    artist: common.artist || "Unknown",
                    title: common.title || path.basename(filepath, path.extname(filepath)),
                    album: common.album || "Unknown",
                    genre: common.genre ? common.genre.toString() : "Unknown",
                    length: dur || "Unknown",
                    year: common.year || "Unknown",
                    track: common.track.no || "",
                    // lyrics: common.lyrics ? common.lyrics.toString() : "Unknown",
                    comment: common.comment ? common.comment.toString() : "Unknown",
                    // rating: common.rating ? common.rating.toString() : "Unknown",
                    composer: common.composer ? common.composer.toString() : "Unknown",
                    // played: 0,
                    // "last played": "Never",
                    "date added": new Date().toString().split(" GMT")[0],
                    quality: format.bitrate ? `${Math.floor(format.bitrate/1000)}kbps` : "Unknown",
                    location: filepath.split(path.basename(filepath, path.extname(filepath)))[0]
                })
                console.log(filepath)
            })
            .catch(err => console.error("Error: ", err.message))
    }

    window.webContents.send("update-library", metadata)
    store.set("state.media.library", metadata)
    console.log("DONE", metadata.length, files.length)
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
    clearInterval(updateInterval)
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (window === null) {
        createWindow()
    }
})
