import { setPlayer } from "../utils"
import C from "./constant"
const fs = require("fs")
const os = require("os")
const path = require("path")
const mm = require("music-metadata")

export const requestUpdateLibrary = () => ({
    type: C.REQUEST_UPDATE,
    isUpdating: true
})

export const shouldUpdateLibrary = (shouldUpdate) => ({
    type: C.SHOULD_UPDATE,
    shouldUpdate
})

export const updateVisibleColumn = (item) => ({
    type: C.VISIBLE_COLUMN,
    item
})

export const downloadAndStream = (checked) => ({
    type: C.DOWNLOAD_AND_STREAM,
    checked
})

export const updatePlayist = (playist, item) => ({
    type: C.UPDATE_PLAYIST,
    playist: playist,
    item: item,
    itemToNewPlayist: null
})

export const addItemToNewPlayist = (item) => ({
    type: C.UPDATE_PLAYIST,
    itemToNewPlayist: item
})

export const updateFavourite = (favourite) => ({
    type: C.UPDATE_FAVOURITE,
    favourite: favourite
})

export const removeMedia = (media) => ({
    type: C.REMOVE_MEDIA,
    media
})

/* export const updateMediaInfo = (media) => ({
    type: C.UPDATE_MEDIA_INFO,
    media
}) */

export const updateLibrary = (data) => ({
    type: C.UPDATE_LIBRARY,
    isUpdating: false,
    data: data
})

export const selectView = (category) => ({
    type: C.SELECT_VIEW,
    category
})

export const nightMode = (night) => ({
    type: C.SELECT_MODE,
    night
})

// Make HTMLMediaElement available in memory
const setCurrentMedia = (media, mediaPlayer) => {
    setPlayer(mediaPlayer)
    return {
        type: C.PLAY_MEDIA,
        media: media
    }
}

export const setCurrentMediaMode = (mode) => ({
    type: C.MEDIA_MODE,
    mode
})

export function playMedia (media, mediaPlayer) {
    return dispatch => {
        if (media === "") {
            // This happens when Control element initially mounts
            return dispatch(setCurrentMedia(media, mediaPlayer))
        }
        // resume play if already in progress and paused
        if (mediaPlayer.currentTime > 0 && mediaPlayer.paused && !mediaPlayer.ended) {
            mediaPlayer.play()
                .then(() => dispatch(setCurrentMediaMode("Playing")))
                .catch(() => dispatch(setCurrentMediaMode("Paused")))
        } else {
            // start a fresh play
            dispatch(setupMediaSrc(media, mediaPlayer))
        }
    }
}

function fetchMediaBuffer (url, loadMedia) {
    return fetch(url, { mode: "no-cors" })
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => loadMedia(arrayBuffer))
        .catch((err) => {
            console.log(err)
            loadMedia(null)
        })
}

function arrayBufferToBuffer (arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength)
    const view = new Uint8Array(buffer)
    for (var i=0; i < buffer.length; ++i) {
        buffer[i] = view[i]
    }
    return buffer
}

function parseBufferMetaData (buffer) {
    mm.parseBuffer(buffer, "audio/mpeg")
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

function setupMediaSrc (url, mediaPlayer) {
    return (dispatch, getState) => {
        const downloadAndStream = getState().settings.downloadAndStream
        var mediaSrc = new MediaSource()

        mediaSrc.addEventListener("sourceopen", function () {
            var sourceBuffer = mediaSrc.addSourceBuffer("audio/mpeg")
            return fetchMediaBuffer(url, function (arrayBuffer) {
                if (!arrayBuffer) {
                    return dispatch(setCurrentMediaMode("Paused"))
                }
                if (downloadAndStream) {
                    const downloadDir = path.join(os.homedir(), "Downloads")
                    const filename = path.join(downloadDir, url+".mp3")
                    const buffer = arrayBufferToBuffer(arrayBuffer)
                    parseBufferMetaData(buffer)
                    fs.writeFile(filename, buffer)
                }
                sourceBuffer.addEventListener("updateend", function () {
                    mediaSrc.endOfStream()
                    mediaPlayer.play()
                        .then(() => {
                            // dispatch(updateMediaInfo(url))
                            dispatch(setCurrentMediaMode("Playing"))
                        })
                        .catch((err) => {
                            console.log(err)
                            dispatch(setCurrentMediaMode("Paused"))
                        })
                })
                sourceBuffer.appendBuffer(arrayBuffer)
                return dispatch(setCurrentMedia(url, mediaPlayer))
            })
        })

        mediaPlayer.src = window.URL.createObjectURL(mediaSrc)
        mediaPlayer.setAttribute("crossorigin", "anonymous")
    }
}

export function searchSong (searchValue, library) {
    const results = []
    if (library.length < 1 || searchValue === "") {
        return results
    }
    for (let i=0; i < library.length; i++) {
        if (library[i].file_name.toString().startsWith(searchValue) ||
            library[i].file_name.toString() === searchValue ||
            (searchValue.length > 2 &&
                library[i].file_name.toString().includes(searchValue)))
        {
            results.push(library[i].file)
        }
    }
    return results
}
