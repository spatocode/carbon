const { dialog, shell } = require("electron")
const { autoUpdater } = require("electron-updater")

const URL = "https://carbonplayer.github.io"

function checkForUpdates (menuItem, focusedWindow, event) {
    autoUpdater.on("error", error => {
        dialog.showMessageBox({
            type: "error",
            buttons: ["Download Update", "Later"],
            title: "Error",
            message: "Application Update Error",
            detail: `
            An error occured while updating the application. Please try 
            downloading an update manually.
            <${(error.stack || error).toString()}>
            `
        }).then((ret) => {
            if (ret.response === 0) {
                shell.openExternal(URL)
            }
        })
    })

    autoUpdater.on("update-downloaded", (event, releaseNotes, releaseNames) => {
        dialog.showMessageBox({
            type: "info",
            title: "Install Updates",
            messge: "Updates downloaded, application will be quit for update..."
        }).then((ret) => {
            setImmediate(() => autoUpdater.quitAndInstall())
        })
    })

    if (!menuItem) {
        setInterval(() => {
            autoUpdater.checkForUpdates()
        }, 60000)
        return
    }

    autoUpdater.autoDownload = false
    menuItem.enabled = false
    autoUpdater.checkForUpdates()

    autoUpdater.on("update-available", () => {
        dialog.showMessageBox({
            type: "info",
            title: "Found Updates",
            message: "Found updates, do you want update now?",
            buttons: ["Sure", "No"]
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                autoUpdater.downloadUpdate()
            }
            else {
                menuItem.enabled = true
            }
        })
    })

    autoUpdater.on("update-not-available", () => {
        dialog.showMessageBox({
            title: "No Updates",
            message: "Current version is up-to-date."
        })
        menuItem.enabled = true
    })
}

module.exports = checkForUpdates
