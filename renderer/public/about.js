const os = window.require("os")
const { shell } = window.require("electron")
const div = document.querySelector(".version")
const repo = document.querySelector(".contribute")
const { version } = require("../../package.json")

div.innerHTML = `${version} (${os.arch()})`
repo.onclick = function () {
    shell.openExternal("http://github.com/carbonplayer/carbon")
}
