/* eslint-disable no-undef */
import C from "../../renderer/actions/constant"
import { media } from "../../renderer/reducers/index"

describe("media", () => {
    it("request update media", () => {
        const state = { isUpdating: false }
        const action = {
            type: C.REQUEST_UPDATE,
            isUpdating: true
        }
        const results = media(state, action)
        expect(results).toEqual({
            isUpdating: true
        })
    })

    it("media mode", () => {
        const state = { mode: "Paused" }
        const action = {
            type: C.MEDIA_MODE,
            mode: "Playing"
        }
        const results = media(state, action)
        expect(results).toEqual({
            mode: "Playing"
        })
    })

    it("update favourite", () => {
        const state = { favourite: [] }
        const action = {
            type: C.UPDATE_FAVOURITE,
            favourite: "Eminem - Farewell"
        }
        const results = media(state, action)
        expect(results).toEqual({
            favourite: ["Eminem - Farewell"]
        })
    })

    it("remove favourite", () => {
        const state = { favourite: ["Eminem - Farewell"] }
        const action = {
            type: C.UPDATE_FAVOURITE,
            favourite: "Eminem - Farewell"
        }
        const results = media(state, action)
        expect(results).toEqual({
            favourite: []
        })
    })

    it("should update library", () => {
        const state = { shouldUpdate: false }
        const action = {
            type: C.SHOULD_UPDATE,
            shouldUpdate: true
        }
        const results = media(state, action)
        expect(results).toEqual({
            shouldUpdate: true
        })
    })

    it("update library", () => {
        const state = {
            library: [],
            isUpdating: true
        }
        const action = {
            type: C.UPDATE_LIBRARY,
            data: ["Eminem - Farewell", "DAX - Dear God"],
            isUpdating: false
        }
        const results = media(state, action)
        expect(results).toEqual({
            library: ["Eminem - Farewell", "DAX - Dear God"],
            isUpdating: false
        })
    })

    it("play media", () => {
        const state = {
            recent: []
        }
        const action = {
            type: C.PLAY_MEDIA,
            media: "Eminem - Farwell",
            source: "Music"
        }
        const results = media(state, action)
        expect(results).toEqual({
            current: "Eminem - Farwell",
            source: "Music",
            recent: ["Eminem - Farwell"]
        })
    })

    it("create new playlist", () => {
        const state = { playlists: [] }
        let action = {
            type: C.INITIAL_ITEM_TO_PLAYLIST,
            itemToNewPlaylist: "Eminem - Farewell"
        }
        let results = media(state, action)
        expect(results).toEqual({
            playlists: [],
            itemToNewPlaylist: "Eminem - Farewell"
        })

        action = {
            type: C.UPDATE_PLAYLIST,
            playlist: "HipHop",
            item: results.itemToNewPlaylist,
            itemToNewPlaylist: null
        }
        results = media(state, action)
        expect(results).toEqual({
            playlists: [["HipHop", "Eminem - Farewell"]],
            itemToNewPlaylist: null
        })
    })

    it("delete playlist", () => {
        const state = {
            playlists: [["HipHop", "Eminem - Farewell"]]
        }
        const action = {
            type: C.DELETE_PLAYLIST,
            playlist: "HipHop",
            itemToNewPlaylist: null
        }
        const results = media(state, action)
        expect(results).toEqual({
            playlists: [],
            itemToNewPlaylist: null
        })
    })

    it("delete playlist item", () => {
        const state = {
            playlists: [["HipHop", "Eminem - Farewell"]]
        }
        const action = {
            type: C.UPDATE_PLAYLIST,
            playlist: "HipHop",
            item: "Eminem - Farewell",
            itemToNewPlaylist: null
        }
        const results = media(state, action)
        expect(results).toEqual({
            playlists: [["HipHop"]],
            itemToNewPlaylist: null
        })
    })

    it("remove media", () => {
        const state = {
            library: [
                {
                    file: "home/ekene/Music/Eminem - Farewell.mp3",
                    file_name: "Eminem - Farewell",
                    title: "Farewell",
                    artist: "Eminem"
                },
                {
                    file: "home/ekene/Music/Joyner Lucas - Devil's work.mp3",
                    file_name: "Joyner Lucas - Devil's work",
                    title: "Devil's work",
                    artist: "Joyner Lucas"
                }
            ]
        }
        const action = {
            type: C.REMOVE_MEDIA,
            media: "home/ekene/Music/Joyner Lucas - Devil's work.mp3"
        }
        const results = media(state, action)
        expect(results).toEqual({
            library: [
                {
                    file: "home/ekene/Music/Eminem - Farewell.mp3",
                    file_name: "Eminem - Farewell",
                    title: "Farewell",
                    artist: "Eminem"
                }
            ]
        })
    })
})
