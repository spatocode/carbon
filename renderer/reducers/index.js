import C from "../actions/constant"

const mediaState = {
    recent: [],
    playists: [],
    favourite: [],
    library: [],
    mode: "Paused",
    isUpdating: false
}

const viewState = {
    category: "Now Playing"
}

const settingsState = {
    visibleColumn: {
        track: true,
        title: true,
        artist: true,
        length: true,
        album: true,
        genre: true,
        rating: false,
        composer: false,
        play_count: false,
        date_added: false,
        location: false,
        last_played: false,
        year: false,
        quality: false,
        comment: false
    }
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

export function settings (state=settingsState, action) {
    switch (action.type) {
    case C.VISIBLE_COLUMN:
        return Object.assign({}, state, {
            visibleColumn: Object.assign({}, state.visibleColumn, action.item)
        })
    default:
        return state
    }
}

function updateRecents (recent, media) {
    if (recent.length < 9) {
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
    case C.UPDATE_MEDIA_INFO:
        return Object.assign({}, state, {
            library: state.library.map((v, i) => {
                return (v.file !== action.media) ? v : Object.assign({}, state, {
                    ...v,
                    play_count: ++v.play_count,
                    last_played: new Date().toString().split(" GMT")[0]
                })
            })
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
