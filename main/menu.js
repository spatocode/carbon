const { app, Menu } = require("electron")

function buildMenu () {
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
                subMenu: [{}]
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
            subMenu: [{
                label: ""
            }]
        },
        {
            label: "Playback",
            subMenu: [{
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
            subMenu: [{}]
        },
        {
            label: "Video",
            subMenu: [{}]
        },
        {
            label: "Help",
            subMenu: [{
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
            subMenu: [{
                label: "Quit",
                accelerator: "Command+Q",
                click: function () {
                    app.quick()
                }
            }]
        })
    }
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function handleOpenFile () {
}

function handleOpenURL () {
}

function handleCreatePlayist () {
}

function handlePlayPause () {
}

function handleStop () {
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
}

function handleUpdates () {
}

module.exports = buildMenu
