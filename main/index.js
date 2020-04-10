const os = require("os")
const path = require("path")
const { app, BrowserWindow, ipcMain } = require("electron")
const Store = require("electron-store")
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
        backgroundColor: "#eee8e8",
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
    initStore()
    fetchMedia()
}

function initStore () {
    const defaults = {
        control: {
            timeRange: 0,
            repeat: false,
            shuffle: false,
            volume: 100,
            timer: 0
        },
        state: {
            media: {
                library: [],
                favourite: [],
                playists: [],
                recent: []
            }
        }
    }
    const store = new Store({ defaults: defaults })
    const homeDir = os.homedir()
    const musicDir = path.join(homeDir, "Music")
    const visibleColumn = {
        track: true,
        title: true,
        artist: true,
        length: true,
        album: true,
        genre: true,
        rating: false,
        composer: false,
        play_count: false,
        date_added: false,
        location: false,
        last_played: false,
        year: false,
        quality: false,
        comment: false
    }

    if (!store.has("libLocation")) {
        store.set("libLocation", [musicDir])
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
        return path.extname(basename) === ".mp3" || basename !== "." || basename[0] !== "."
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
                    lyrics: common.lyrics ? common.lyrics.toString() : "Unknown",
                    comment: common.comment ? common.comment.toString() : "Unknown",
                    rating: common.rating ? common.rating.toString() : "Unknown",
                    common: common.composer ? common.composer.toString() : "Unknown",
                    play_count: 0,
                    last_played: "Never",
                    date_added: new Date().toString().split(" GMT")[0],
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
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (window === null) {
        createWindow()
    }
})
