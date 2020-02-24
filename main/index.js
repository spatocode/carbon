const os = require("os")
const path = require("path")
const { app, BrowserWindow, ipcMain } = require("electron")
const klaw = require("klaw")
const through2 = require("through2")
const buildMenu = require("./menu")

let window

const createWindow = () => {
    fetchMedia()

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
}

function fetchMedia () {
    const homeDir = os.homedir()
    const musicDir = path.join(homeDir, "Music")
    const downloadsDir = path.join(homeDir, "Downloads")
    const videosDir = path.join(homeDir, "Videos")
    const dirs = [musicDir, videosDir, downloadsDir]
    const excludeDirFilter = through2.obj(function (item, enc, next) {
        if (!item.stats.isDirectory()) {
            this.push(item)
        }
        next()
    })
    const filterFunc = item => {
        const basename = path.basename(item)
        return basename === "." || basename[0] !== "."
    }

    ipcMain.on("should-update", (event, arg) => {
        if (arg) {
            const files = []
            klaw(musicDir, { filter: filterFunc })
                .pipe(excludeDirFilter)
                .on("data", file => {
                    var ext= path.extname(file.path)
                    if (ext === ".mp3" || ext === ".mp4" || ext === ".mpeg" || ext === ".3gp") {
                        files.push(file)
                    }
                })
                .on("end", () => {
                    window.webContents.send("update-library", files)
                })
                .on("error", err => console.error(err))
        }
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
