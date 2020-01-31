import C from "./constant"

export const selectMenu = (category) => ({
    type: C.SELECT_MENU,
    category
})

export const requestLyric = () => ({
    type: C.REQUEST_REMOTE,
    isFetching: true
})

export const receiveLyric = (json) => ({
    type: C.REQUEST_DATA,
    isFetching: false,
    error: false,
    data: json.data
})

export const searchLocalMusic = (name) => ({
    type: C.SEARCH_LOCAL_MUSIC,
    name
})

export const searchOnlineMusic = (name) => ({
    type: C.SEARCH_ONLINE_MUSIC,
    name
})

export const errorReport = () => ({
    type: C.REQUEST_REMOTE,
    error: true
})

function fetchLyric (url) {
    return dispatch => {
        dispatch(requestLyric())
        return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(receiveLyric(json)))
            .catch(error => dispatch(errorReport(error)))
    }
}

function shouldFetchLyric (state) {
    const data = state.data.items
    if (data.length === 0) {
        return true
    } else if (state.isFetching) {
        return false
    } else {
        return false
    }
}

export function fetchLyricIfNeeded (url) {
    return (dispatch, getState) => {
        if (shouldFetchLyric(getState())) {
            dispatch(fetchLyric(url))
        }
    }
}
