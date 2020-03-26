const os = require("os")
const { app, dialog, Menu } = require("electron")

let window

function buildMenu (win) {
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
                submenu: [{
                    label: "Joyner Lucas - Devil's work"
                }]
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
                click: handlePlayPause
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
        defaultPath: home
        // TODO: filters somehow doesn't work on linux.
        // Let's comment it out till a fix comes.
        /* filters: [
            { name: "All media files", extensions: [] },
            { name: "Audio files", extensions: ["mp3", "wma", "midi", "mka", "m4a"] },
            { name: "Video files", extensions: ["mp4", "mpeg", "mpg", "3gp", "mkv", "wmv", "avi"] }
        ] */
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
    window.webContents.send("register-playist", true)
}

function handlePlayPause () {
    window.webContents.send("play-media", true)
}

function handleStop () {
    window.webContents.send("stop-media", true)
}

function handlePrevious () {
}

function handleNext () {
}

function handleRewind () {
}

function handleFastFoward () {
}

function handleShuffle () {
}

function handleRepeat () {
}

function handleAbout () {
    dialog.showMessageBox({ // TODO: Add an icon
        type: "info",
        buttons: ["Ok"],
        defaultId: 0,
        title: "About",
        message: "Carbon Media Player",
        detail: `
            Carbon media player is a free and open source media player 
            created by Ekene Izukanne. Carbon is cross-platform which 
            means that it works on essentially all popular platforms.

            Copyright (c) 2020 Ekene Izukanne
            `
    })
}

function handleUpdates () {
}

module.exports = buildMenu
