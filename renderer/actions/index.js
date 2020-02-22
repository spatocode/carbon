import C from "./constant"

export const selectView = (category) => ({
    type: C.SELECT_VIEW,
    category
})

export const selectTab = (tabItem) => ({
    type: C.SELECT_TAB,
    tabItem
})

export const nightMode = (night) => ({
    type: C.SELECT_MODE,
    night
})

export const playMedia = (media) => ({
    type: C.PLAY_MEDIA,
    media
})

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

function searchLocalMedia (media) {
    // TODO: Async code of searching the file system for song
    // if the song is not found in disk, call searchOnlineSong to search online
}

function searchOnlineMedia (media) {
    // TODO: Async code of searching the network for song
    // if song is found return it and prompt/request the user to download
}

searchOnlineMedia()
