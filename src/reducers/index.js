import C from "../actions/constant"

const lyricState = {
    isFetchingLyric: false,
    error: false,
    items: []
}

export function view (state={ category: "Now Playing", tab: "All" }, action) {
    switch (action.type) {
    case C.SELECT_VIEW:
        return Object.assign({}, state, {
            category: action.category
        })
    case C.SELECT_TAB:
        return Object.assign({}, state, {
            tab: action.tabItem
        })
    default:
        return state
    }
}

export function mode (state={ night: false }, action) {
    switch (action.type) {
    case C.SELECT_MODE:
        return Object.assign({}, state, {
            night: action.night
        })
    default:
        return state
    }
}

export function lyric (state=lyricState, action) {
    switch (action.type) {
    case C.REQUEST_LYRIC:
        return Object.assign({}, state, {
            isFetching: action.isFetching
        })
    case C.RECEIVE_LYRIC:
        return Object.assign({}, state, {
            isFetching: action.isFetching,
            error: action.error,
            items: action.data
        })
    case C.ERROR_REPORT:
        return Object.assign({}, state, {
            isFetching: action.isFetching,
            error: action.error
        })
    default:
        return state
    }
}

export const playState = (state={ isFetchingSong: false }, action) => {
    switch (action.type) {
    case C.PLAY_SONG:
        return Object.assign({}, state, {
            song: action.song
        })
    default:
        return state
    }
}
