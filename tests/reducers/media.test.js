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

    it("create new playist", () => {
        const state = { playists: [] }
        var action = {
            type: C.UPDATE_PLAYIST,
            itemToNewPlayist: "Eminem - Farewell"
        }
        var results = media(state, action)
        expect(results).toEqual({
            playists: [],
            itemToNewPlayist: "Eminem - Farewell"
        })

        action = {
            type: C.UPDATE_PLAYIST,
            playist: "HipHop",
            item: results.itemToNewPlayist,
            itemToNewPlayist: null
        }
        results = media(state, action)
        expect(results).toEqual({
            playists: [["HipHop", "Eminem - Farewell"]],
            itemToNewPlayist: null
        })
    })

    it("delete playist", () => {
        const state = {
            playists: [["HipHop", "Eminem - Farewell"]]
        }
        var action = {
            type: C.UPDATE_PLAYIST,
            playist: "HipHop",
            itemToNewPlayist: null
        }
        var results = media(state, action)
        expect(results).toEqual({
            playists: [],
            itemToNewPlayist: null
        })
    })

    it("delete playist item", () => {
        const state = {
            playists: [["HipHop", "Eminem - Farewell"]]
        }
        var action = {
            type: C.UPDATE_PLAYIST,
            playist: "HipHop",
            item: "Eminem - Farewell",
            itemToNewPlayist: null
        }
        var results = media(state, action)
        expect(results).toEqual({
            playists: [["HipHop"]],
            itemToNewPlayist: null
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
