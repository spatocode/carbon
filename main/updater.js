const { autoUpdater, app, dialog, shell } = require("electron")

function checkForUpdates (interval) {
    const server = ""
    const feed = `${server}/update${process.platform}/${app.getVersion()}`

    autoUpdater.setFeedURL(feed)
    autoUpdater.on("update-downloaded", (event, releaseNotes, releaseNames) => {
        dialog.showMessageBox({
            type: "info",
            buttons: ["Restart", "Later"],
            title: "Application Update",
            message: process.platform === "win32" ? releaseNotes : releaseNames,
            detail: "A new version of Carbon Media Player has been downloaded. Restart the application to apply the updates."
        }).then((ret) => {
            if (ret.response === 0) {
                autoUpdater.quitAndInstall()
            }
        })
    })

    autoUpdater.on("error", message => {
        dialog.showMessageBox({
            type: "error",
            buttons: ["Download Update", "Later"],
            title: "Error",
            message: "Application Update Error",
            detail: `
            An error occured while updating the application. Please try 
            downloading an update manually.
            `
        }).then((ret) => {
            if (ret.response === 0) {
                shell.openExternal(feed)
            }
        })
    })
    if (interval) {
        return setInterval(() => {
            autoUpdater.checkForUpdates()
        }, interval)
    }
    return autoUpdater.checkForUpdates()
}

module.exports = checkForUpdates
