/* eslint-disable no-case-declarations */
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
        composer: false,
        "date added": false,
        location: false,
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
    case C.DOWNLOAD_AND_STREAM:
        return Object.assign({}, state, {
            downloadAndStream: action.checked
        })
    default:
        return state
    }
}

function updateRecents (recent, media) {
    if (recent.length < 9) {
        if (media !== "") {
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
            source: action.source,
            recent: updateRecents(state.recent, action.media)
        })
    case C.MEDIA_MODE:
        return Object.assign({}, state, {
            mode: action.mode
        })
    case C.UPDATE_PLAYIST:
        return updatePlayists(action, state)
    case C.UPDATE_FAVOURITE:
        let isIncluded
        state.favourite.forEach((val) => {
            if (val.file === action.favourite.file) {
                isIncluded = true
            }
        })
        return isIncluded
            ? Object.assign({}, state, {
                favourite: state.favourite.filter(fav => fav.file !== action.favourite.file)
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
    /* case C.UPDATE_MEDIA_INFO:
        return Object.assign({}, state, {
            library: state.library.map((v, i) => {
                return (v.file !== action.media) ? v : Object.assign({}, v, {
                    play_count: ++v.play_count,
                    last_played: new Date().toString().split(" GMT")[0]
                })
            })
        }) */
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

function updatePlayists (action, state) {
    // This happens only when registering a new playist.
    // It captures the initial item before eventually adding
    // it to playist
    if (!action.playist && !action.item) {
        return Object.assign({}, state, {
            playists: state.playists,
            itemToNewPlayist: action.itemToNewPlayist
        })
    }
    // Delete playist
    else if (!action.itemToNewPlayist && !action.item) {
        for (let i=0; i < state.playists.length; i++) {
            if (state.playists[i][0] === action.playist) {
                state.playists.splice(i, 1)
                return Object.assign({}, state, {
                    playists: state.playists,
                    itemToNewPlayist: action.itemToNewPlayist
                })
            }
        }
    }

    for (var i=0; i < state.playists.length; i++) {
        // Check if this is the playist to update
        if (state.playists[i][0] === action.playist) {
            // Delete item from playist if item exists in playist
            if (state.playists[i].includes(action.item)) {
                const playist = state.playists[i].filter(pl => pl !== action.item)
                state.playists[i] = playist
                return Object.assign({}, state, {
                    playists: [...state.playists],
                    itemToNewPlayist: action.itemToNewPlayist
                })
            }
            // Add item to playist if the playist name exists in state
            const playist = [...state.playists[i], action.item]
            state.playists[i] = playist
            return Object.assign({}, state, {
                playists: [...state.playists],
                itemToNewPlayist: action.itemToNewPlayist
            })
        }
    }

    // Create new playist with initial item
    const newPlayist = [action.playist]
    // We need to check if this playist should be created with item
    // This may happen if we create a playist from native menu
    if (action.item !== "") {
        newPlayist.push(action.item)
    }
    return Object.assign({}, state, {
        playists: [...state.playists, newPlayist],
        itemToNewPlayist: action.itemToNewPlayist
    })
}
