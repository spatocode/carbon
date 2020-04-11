const os = require("os")
const { app, dialog, Menu } = require("electron")
const Store = require("electron-store")

let window

function buildMenu (win) {
    const menuItem = []
    const store = new Store()
    if (store.has("state.media.recent")) {
        const recent = store.get("state.media.recent")
        recent.forEach((song) => {
            menuItem.push({
                label: song,
                click: handlePlay
            })
        })
    }
    window = win
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
                submenu: [...menuItem]
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
            }]
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
                label: "Speed"
            }]
        },
        {
            label: "Video",
            submenu: [{
                label: "Stream"
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
}

function handleCreatePlayist () {
    window.webContents.send("register-playist", "register-playist")
}

function handlePlay (e) {
    if (e.label !== "Play/Pause") {
        window.webContents.send("control", e.label)
        return
    }
    window.webContents.send("playpause", "playpause")
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
    dialog.showMessageBox({ // TODO: Add an icon
        type: "info",
        buttons: ["Ok"],
        defaultId: 0,
        title: "About",
        message: "Carbon Media Player",
        detail: `
            Carbon Media Player is a beautiful and elegant media player 
            crafted with user experience in mind. It contains lots of 
            features which gives you an unforgettable experience while
            playing your media. Carbon is also cross-platform which means that 
            it works on essentially all popular platforms.

            Copyright (c) 2020 Ekene Izukanne
            `
    })
}

function handleUpdates () {
}

module.exports = buildMenu
