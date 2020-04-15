const os = require("os")
const path = require("path")
const { app, dialog, Menu, nativeImage } = require("electron")
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
                label: "Create playist",
                accelerator: "Ctrl+N",
                click: handleCreatePlayist
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
            submenu: [{
                label: "Open devtools",
                click: function () {
                    window.webContents.openDevTools()
                }
            }, {
                label: "Reload",
                click: function () {
                    window.webContents.reload()
                }
            }, ...visibleItems]
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
    const home = os.homedir()
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

function handleCreatePlayist () {
    window.webContents.send("register-playist", "register-playist")
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
    const icon = nativeImage.createFromPath(path.join(__dirname, "../", "icons", "carbon.png"))
    dialog.showMessageBox({
        type: "info",
        buttons: ["Ok"],
        defaultId: 0,
        icon: icon,
        title: "About",
        message: "Carbon Media Player",
        detail: `
        Carbon is a beautiful and elegant desktop media player crafted
        with user experience in mind. It provides features and great
        user interface which gives you an unforgettable experience while
        playing your media. Carbon is also cross-platform which means
        that it works on essentially all popular platforms.

        Copyright (c) 2020 Ekene Izukanne
        `
    })
}

function handleUpdates () {
    if (!isDev) {
        checkForUpdates()
    }
}

module.exports = buildMenu
