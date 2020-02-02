import C from "./constant"

export const selectMenu = (category) => ({
    type: C.SELECT_MENU,
    category
})

export const playSong = (song) => ({
    type: C.PLAY_SONG,
    song
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

export const requestSong = () => ({
    type: C.SEARCH_LOCAL_SONG,
    isFetchingSong: true
})

export const receiveSong = (json) => ({
    type: C.REQUEST_DATA,
    isFetchingSong: false,
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

export function searchSong (song) {
    return (dispatch) => {
        dispatch(fetchSong(song))
    }
}

function fetchSong (song) {
    return dispatch => {
        dispatch(requestSong())
        return searchLocalSong(song)
    }
}

function searchLocalSong (song) {
    // TODO: Async code of searching the file system for song
    // if the song is not found in disk, call searchOnlineSong to search online
}

function searchOnlineSong (song) {
    // TODO: Async code of searching the network for song
    // if song is found return it and prompt/request the user to download
}
