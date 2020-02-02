import C from "../actions/constant"

const initialState = {
    isFetchingLyric: false,
    error: false,
    items: []
}

export function selectView (state={ category: "Now Playing" }, action) {
    switch (action.type) {
    case C.SELECT_MENU:
        return Object.assign({}, state, {
            category: action.category
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

export function lyric (state=initialState, action) {
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
