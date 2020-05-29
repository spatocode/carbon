/* eslint-disable no-case-declarations */
import C from "../actions/constant"

const mediaState = {
    recent: [],
    playlists: [],
    favourite: [],
    library: [],
    mode: "Paused",
    isUpdating: false,
    updatedMediaIndex: null
}

const viewState = {
    category: "Now Playing",
    fullMenu: true
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
    case C.FULL_MENU:
        return Object.assign({}, state, {
            fullMenu: action.fullMenu
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
    case C.UPDATE_PLAYLIST:
        return updatePlaylists(action, state)
    case C.INITIAL_ITEM_TO_PLAYLIST:
        // Capture initial item before eventually adding
        // it to playlist
        return Object.assign({}, state, {
            itemToNewPlaylist: action.itemToNewPlaylist
        })
    case C.DELETE_PLAYLIST:
        for (let i=0; i < state.playlists.length; i++) {
            if (state.playlists[i][0] === action.playlist) {
                state.playlists.splice(i, 1)
                return Object.assign({}, state, {
                    playlists: state.playlists,
                    itemToNewPlaylist: action.itemToNewPlaylist
                })
            }
        }
        break
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
    case C.UPDATE_MEDIA_INFO:
        let updatedMediaIndex
        const library = state.library.map((v, i) => {
            if (v.file !== action.media) {
                return v
            } else {
                updatedMediaIndex = i
                return Object.assign({}, v, {
                    played: v.played+1,
                    "last played": new Date().toString().split(" GMT")[0]
                })
            }
        })
        return Object.assign({}, state, {
            library: library,
            updatedMediaIndex: updatedMediaIndex
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

function updatePlaylists (action, state) {
    for (var i=0; i < state.playlists.length; i++) {
        // Check if this is the playlist to update
        if (state.playlists[i][0] === action.playlist) {
            // Delete item from playlist if item exists in playlist
            if (state.playlists[i].includes(action.item)) {
                const playlist = state.playlists[i].filter(pl => pl !== action.item)
                state.playlists[i] = playlist
                return Object.assign({}, state, {
                    playlists: [...state.playlists],
                    itemToNewPlaylist: action.itemToNewPlaylist
                })
            }
            // Add item to playlist if the playlist name exists in state
            const playlist = [...state.playlists[i], action.item]
            state.playlists[i] = playlist
            return Object.assign({}, state, {
                playlists: [...state.playlists],
                itemToNewPlaylist: action.itemToNewPlaylist
            })
        }
    }

    // Create new playlist with initial item
    const newPlaylist = [action.playlist]
    // We need to check if this playlist should be created with item
    // This may happen if we create a playlist from native menu
    if (action.item !== "") {
        newPlaylist.push(action.item)
    }
    return Object.assign({}, state, {
        playlists: [...state.playlists, newPlaylist],
        itemToNewPlaylist: action.itemToNewPlaylist
    })
}
