const { dialog, shell } = require("electron")
const { autoUpdater } = require("electron-updater")
const isDev = require("electron-is-dev")
const { url } = require("../package.json")

const URL = url

function checkForUpdates (menuItem, focusedWindow, event) {
    autoUpdater.setFeedURL("https://github.com/carbonplayer/carbon/releases")
    autoUpdater.on("error", error => {
        if (error.toString() === "Error: net::ERR_INTERNET_DISCONNECTED") {
            return
        }
        dialog.showMessageBox({
            type: "error",
            buttons: ["Download Update", "Later"],
            title: "Error",
            message: "Application Update Error",
            detail: `
            An error occured while updating the application. Please try 
            downloading an update manually.
                
                <${isDev ? (error.stack || error).toString() : null}>
            `
        }).then((ret) => {
            if (ret.response === 0) {
                shell.openExternal(URL)
            }
        }).catch()
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

    // check if function is not called from menu
    if (!menuItem) {
        var interval = setInterval(() => {
            autoUpdater.checkForUpdates()
        }, 60000)
        return interval
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
        }).then(ret => {
            if (ret.response === 0) {
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
