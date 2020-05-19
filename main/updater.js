const { dialog, shell } = require("electron")
const { autoUpdater } = require("electron-updater")
const isDev = require("electron-is-dev")
const { url } = require("../package.json")

const URL = url

function checkForUpdates (menuItem) {
    if (!isDev || process.platform === "linux") {
        return
    }
    let availableUpdate
    autoUpdater.once("error", error => {
        if (error.code === "ENOENT" || error.toString() === "Error: net::ERR_INTERNET_DISCONNECTED") {
            return
        }
        // Make sure there's an update before showing error message
        if (availableUpdate) {
            dialog.showMessageBox({
                type: "error",
                buttons: ["Download Update", "Later"],
                title: "Error",
                message: "Application Update Error",
                detail: `
                An error occured while updating Carbon Player. Please try 
                downloading an update manually.
                `
            }).then((ret) => {
                if (ret.response === 0) {
                    shell.openExternal(URL)
                }
            }).catch(error => error)
        }
    })

    autoUpdater.on("update-downloaded", (event, releaseNotes, releaseNames) => {
        dialog.showMessageBox({
            type: "info",
            title: "Install Updates",
            message: "Updates downloaded, application will be quit for update..."
        }).then((ret) => {
            setImmediate(() => autoUpdater.quitAndInstall())
        }).catch(error => error)
    })

    autoUpdater.on("update-available", () => {
        if (!menuItem) {
            availableUpdate = true
        } else { // Only show message if we're calling from a menu item
            dialog.showMessageBox({
                type: "info",
                title: "New Update",
                message: "Found updates, do you want update now?",
                buttons: ["Sure", "No"]
            }).then(ret => {
                if (ret.response === 0) {
                    autoUpdater.downloadUpdate()
                }
                else {
                    menuItem.enabled = true
                    menuItem.label = "Download Available Update"
                    menuItem.click = function () {
                        autoUpdater.downloadUpdate()
                    }
                }
            }).catch(error => error)
        }
    })

    // check if function is not called from menu
    if (!menuItem) {
        var interval = setInterval(() => {
            autoUpdater.checkForUpdates()
        }, 100000)
        return interval
    }

    autoUpdater.autoDownload = false
    menuItem.enabled = false
    autoUpdater.checkForUpdates()

    autoUpdater.on("update-not-available", () => {
        dialog.showMessageBox({
            title: "No Updates",
            message: "Current version is up-to-date."
        })
        menuItem.enabled = true
    })
}

module.exports = checkForUpdates
