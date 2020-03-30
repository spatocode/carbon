import C from "../actions/constant"

const lyricState = {
    isFetchingLyric: false,
    error: false,
    data: []
}

const mediaState = {
    recent: [],
    playists: [],
    favourite: [],
    library: [],
    mode: "Paused",
    isUpdating: false
}

const viewState = {
    category: "Now Playing",
    settingsTab: "General"
}

export function view (state=viewState, action) {
    switch (action.type) {
    case C.SELECT_VIEW:
        return Object.assign({}, state, {
            category: action.category
        })
    case C.SELECT_SETTINGS_TAB:
        return Object.assign({}, state, {
            settingsTab: action.tabItem
        })
    default:
        return state
    }
}

/* export function settings (state=settingsState, action) {
    switch (action.type) {
    case C.SELECT_SETTINGS_TAB:
        return Object.assign({}, state, {
            tab: action.tabItem
        })
    default:
        return state
    }
} */

function updateRecents (recent, media) {
    if (recent.length < 9) {
        console.log("Lesser than")
        if (media !== "") {
            console.log("Push")
            recent.push(media)
            return recent
        }
    } else {
        recent.shift()
        recent.push(media)
        return recent
    }
    return recent
}

export function media (state=mediaState, action) {
    switch (action.type) {
    case C.PLAY_MEDIA:
        return Object.assign({}, state, {
            current: action.media,
            recent: updateRecents(state.recent, action.media)
        })
    case C.MEDIA_MODE:
        return Object.assign({}, state, {
            mode: action.mode
        })
    case C.UPDATE_PLAYIST:
        return Object.assign({}, state, {
            playists: updatePlayists(action.playist, action.item, state.playists),
            itemToNewPlayist: action.itemToNewPlayist
        })
    case C.UPDATE_FAVOURITE:
        return (state.favourite.includes(action.favourite))
            ? Object.assign({}, state, {
                favourite: state.favourite.filter(fav => fav !== action.favourite)
            })
            : Object.assign({}, state, {
                favourite: [...state.favourite, action.favourite]
            })
    case C.REMOVE_MEDIA:
        return Object.assign({}, state, {
            library: state.library.filter(song => song.file !== action.media)
        })
    case C.REQUEST_UPDATE:
        return Object.assign({}, state, {
            isUpdating: action.isUpdating
        })
    case C.UPDATE_LIBRARY:
        return Object.assign({}, state, {
            library: action.data,
            isUpdating: action.isUpdating
        })
    case C.SHOULD_UPDATE:
        return Object.assign({}, state, {
            shouldUpdate: action.shouldUpdate
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
            data: [...state.data, action.data]
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

function updatePlayists (playist, item, playists) {
    if (!playist && !item) {
        return playists
    }
    for (var i=0; i < playists.length; i++) {
        if (playists[i].includes(playist)) {
            playists[i].push(item)
            return playists
        }
    }
    playists.push([playist, item])
    return playists
}
