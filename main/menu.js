const path = require("path")
const { app, dialog, Menu, BrowserWindow } = require("electron")
const Store = require("electron-store")
const isDev = require("electron-is-dev")
const checkForUpdates = require("./updater")

let window

function buildMenu (win) {
    const speedItem = []
    const recentItem = []
    const visibleItems = []
    const store = new Store()
    const playbackrate = store.get("control.playbackrate")
    const visibleColumn = store.get("state.settings.visibleColumn")
    const entries = Object.entries(visibleColumn)
    window = win

    if (store.has("state.media.recent")) {
        const recent = store.get("state.media.recent")
        recent.forEach((song) => {
            recentItem.push({
                label: song,
                click: handlePlay
            })
        })
    }

    entries.forEach((v) => {
        visibleItems.push({
            label: v[0].charAt(0).toUpperCase()+v[0].slice(1),
            type: "checkbox",
            checked: v[1],
            click: handleVisibleColumn
        })
    })

    const speed = ["Very Slow", "Slower", "Slow", "Normal", "Fast", "Faster", "Very Fast"]
    speed.forEach((v) => {
        speedItem.push({
            label: `${v}`,
            type: "radio",
            checked: playbackrate === v,
            click: handleRate
        })
    })

    const devTools = isDev ? [{
        label: "Open devtools",
        click: function () {
            window.webContents.openDevTools()
        }
    }, {
        label: "Reload",
        click: function () {
            window.webContents.reload()
        }
    }] : []

    const template = [
        {
            label: "Media",
            submenu: [{
                label: "Open file",
                accelerator: "Ctrl+O",
                click: handleOpenFile
            }, {
                label: "Open URL",
                accelerator: "Ctrl+U",
                click: handleOpenURL
            }, {
                label: "Open recent",
                submenu: [...recentItem]
            }, {
                label: "Create playlist",
                accelerator: "Ctrl+N",
                click: handleCreatePlaylist
            }, {
                type: "separator"
            }, {
                label: "Exit",
                accelerator: "Alt+F4",
                role: "quit"
            }]
        },
        {
            label: "View",
            submenu: [...devTools, ...visibleItems]
        },
        {
            label: "Playback",
            submenu: [{
                label: "Play/Pause",
                click: handlePlay
            }, {
                label: "Stop",
                click: handleStop
            }, {
                type: "separator"
            }, {
                label: "Previous",
                click: handlePrevious
            }, {
                label: "Next",
                click: handleNext
            }, {
                label: "Rewind",
                click: handleRewind
            }, {
                label: "Fast forward",
                click: handleFastFoward
            }, {
                type: "separator"
            }, {
                label: "Shuffle",
                click: handleShuffle
            }, {
                label: "Repeat",
                click: handleRepeat
            }]
        },
        {
            label: "Audio",
            submenu: [{
                label: "Rate",
                submenu: [...speedItem]
            }, {
                label: "Increase volume",
                click: handleVolume
            }, {
                label: "Decrease volume",
                click: handleVolume
            }, {
                label: "Mute",
                click: handleMute
            }]
        },
        {
            label: "Help",
            submenu: [{
                label: "Check for updates",
                click: handleUpdates
            }, {
                label: "About",
                click: handleAbout
            }]
        }
    ]
    if (process.platform === "darwin") { // TODO: Add more macOS specific menus
        const name = app.getName()
        template.unshift({
            label: name,
            submenu: [{
                label: "Quit",
                accelerator: "Command+Q",
                click: function () {
                    app.quit()
                }
            }]
        })
    }
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function handleOpenFile () {
    const home = app.getPath("home")
    dialog.showOpenDialog(window, {
        title: "Select a media file to open",
        properties: ["openFile"],
        defaultPath: home,
        filters: [
            { name: "Audio files", extensions: ["mp3", "wma", "midi", "mka", "m4a"] }
        ]
    }).then(result => {
        if (result.filePaths.length > 0 && window) {
            window.webContents.send("open-file", result.filePaths)
        }
    }).catch(err => {
        console.log(err)
    })
}

function handleOpenURL () {
    window.webContents.send("open-url", "open-url")
}

function handleCreatePlaylist () {
    window.webContents.send("register-playlist", "register-playlist")
}

function handleVisibleColumn (e) {
    window.webContents.send("toggle-visible-column", [e.label, e.checked])
}

function handleVolume (e) {
    if (e.label === "Increase volume") {
        window.webContents.send("volume", "increase")
        return
    }
    window.webContents.send("volume", "decrease")
}

function handleMute () {
    window.webContents.send("volume", "mute")
}

function handleRate (e) {
    window.webContents.send("playbackrate", e.label)
}

function handlePlay (e) {
    if (e.label !== "Play/Pause") {
        window.webContents.send("control", e.label)
        return
    }
    window.webContents.send("control", "playpause")
}

function handleStop () {
    window.webContents.send("control", "stop-media")
}

function handlePrevious () {
    window.webContents.send("control", "previous-media")
}

function handleNext () {
    window.webContents.send("control", "next-media")
}

function handleRewind () {
    window.webContents.send("control", "rewind-media")
}

function handleFastFoward () {
    window.webContents.send("control", "fforward-media")
}

function handleShuffle () {
    window.webContents.send("control", "shuffle-media")
}

function handleRepeat () {
    window.webContents.send("control", "repeat-media")
}

function handleAbout () {
    const childWindow = new BrowserWindow({
        parent: window,
        modal: true,
        show: false,
        width: 620,
        height: 300,
        autoHideMenuBar: true,
        resizable: false,
        backgroundColor: "#bebdbd",
        webPreferences: {
            nodeIntegration: true
        }
    })

    childWindow.webContents.on("dom-ready", () => {
        childWindow.show()
    })

    childWindow.loadFile(path.join(__dirname, "../renderer/public/about.html"))
}

function handleUpdates (menuItem) {
    if (!isDev) {
        checkForUpdates(menuItem)
    }
}

module.exports = buildMenu
