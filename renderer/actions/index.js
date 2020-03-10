import C from "./constant"

export const requestUpdateLibrary = () => ({
    type: C.REQUEST_UPDATE,
    isUpdating: true
})

export const shouldUpdateLibrary = (shouldUpdate) => ({
    type: C.SHOULD_UPDATE,
    shouldUpdate
})

export const updatePlayist = (playist, item) => ({
    type: C.UPDATE_PLAYIST,
    playist: playist,
    item: item,
    itemToNewPlayist: null
})

export const registerNewPlayist = (item) => ({
    type: C.UPDATE_PLAYIST,
    itemToNewPlayist: item
})

export const updateFavourite = (favourite) => ({
    type: C.UPDATE_FAVOURITE,
    favourite: favourite
})

export const updateLibrary = (data) => ({
    type: C.UPDATE_LIBRARY,
    isUpdating: false,
    data: data
})

export const selectView = (category) => ({
    type: C.SELECT_VIEW,
    category
})

export const selectSettingsTab = (tabItem) => ({
    type: C.SELECT_SETTINGS_TAB,
    tabItem
})

export const nightMode = (night) => ({
    type: C.SELECT_MODE,
    night
})

// Make HTMLMediaElement available in state
const setCurrentMedia = (media, mediaPlayer) => ({
    type: C.PLAY_MEDIA,
    media: media,
    player: mediaPlayer
})

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
        if (mediaPlayer.currentTime > 0 && mediaPlayer.paused) {
            mediaPlayer.play()
                .then(() => dispatch(setCurrentMediaMode("Playing")))
                .catch((err) => console.log(err))
        } else {
            // start a fresh play
            dispatch(setupMediaSrc(media, mediaPlayer))
        }
    }
}

function fetchMediaBuffer (url, loadMedia) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => loadMedia(arrayBuffer))
        .catch(err => console.log(err))
}

function setupMediaSrc (filepath, mediaPlayer) {
    return dispatch => {
        if (!MediaSource.isTypeSupported("audio/mpeg")) {
            console.log("Codec not supported")
            return dispatch(setCurrentMedia())
        }
        var mediaSrc = new MediaSource()

        mediaSrc.addEventListener("sourceopen", function () {
            var sourceBuffer = mediaSrc.addSourceBuffer("audio/mpeg")
            return fetchMediaBuffer(filepath, function (buffer) {
                sourceBuffer.addEventListener("updateend", function () {
                    mediaSrc.endOfStream()
                    mediaPlayer.play()
                        .then(() => dispatch(setCurrentMediaMode("Playing")))
                        .catch((err) => {
                            console.log(err)
                            dispatch(setCurrentMediaMode("Paused"))
                        })
                })
                sourceBuffer.appendBuffer(buffer)
                return dispatch(setCurrentMedia(filepath, mediaPlayer))
            })
        })

        mediaPlayer.src = window.URL.createObjectURL(mediaSrc)
        mediaPlayer.setAttribute("crossorigin", "anonymous")
    }
}

export const requestLyric = () => ({
    type: C.REQUEST_LYRIC,
    isFetchingLyric: true
})

export const receiveLyric = (json) => ({
    type: C.RECEIVE_LYRIC,
    isFetchingLyric: false,
    error: false,
    data: json.data
})

export const requestMedia = () => ({
    type: C.SEARCH_LOCAL_MEDIA,
    isFetchingMedia: true
})

export const receiveMedia = (json) => ({
    type: C.REQUEST_DATA,
    isFetchingMedia: false,
    error: false,
    data: json.data
})

export const errorReport = () => ({
    type: C.REQUEST_REMOTE,
    error: true
})

function fetchLyric (lyric) {
    return dispatch => {
        dispatch(requestLyric())
        return fetch(lyric)
            .then(response => response.json())
            .then(json => {
                if (json.data === "") {
                    json = scrapLyric()
                }
                dispatch(receiveLyric(json))
            })
            .catch(error => dispatch(errorReport(error)))
    }
}

function scrapLyric () {
}

function shouldFetchLyric (state, lyric) {
    const lyrics = state.data.lyrics
    if (state.isFetchingLyric || lyrics.includes(lyric)) {
        return false
    }
    return true
}

export function fetchLyricIfNeeded (lyric) {
    return (dispatch, getState) => {
        if (shouldFetchLyric(getState(), lyric)) {
            dispatch(fetchLyric(lyric))
        }
    }
}

export function searchSong (media) {
    return (dispatch) => {
        dispatch(fetchMedia(media))
    }
}

function fetchMedia (media) {
    return dispatch => {
        dispatch(requestMedia())
        return searchLocalMedia(media)
    }
}

function searchLocalMedia (media, library) {
    // TODO: Async code of searching the file system for song
    // if the song is not found in disk, call searchOnlineSong to search online
}

function searchOnlineMedia (media) {
    // TODO: Async code of searching the network for song
    // if song is found return it and prompt/request the user to download
}

searchOnlineMedia()
