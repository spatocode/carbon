/* eslint-disable no-undef */
import C from "../renderer/actions/constant"
import { lyric } from "../renderer/reducers/index"

describe("lyric", () => {
    it("request lyric", () => {
        const state = { isFetching: false }
        const action = {
            type: C.REQUEST_LYRIC,
            isFetching: true
        }
        const results = lyric(state, action)
        expect(results).toEqual({
            isFetching: true
        })
    })

    it("receive lyric", () => {
        const state = { isFetching: true, data: [] }
        const action = {
            type: C.RECEIVE_LYRIC,
            isFetching: false,
            error: false,
            data: {
                artist: "Ekene",
                title: "Farewell",
                lyric: `
                    This is just a test lyric
                `
            }
        }
        const results = lyric(state, action)
        expect(results).toEqual({
            isFetching: false,
            data: [{
                artist: "Ekene",
                title: "Farewell",
                lyric: `
                    This is just a test lyric
                `
            }]
        })
    })

    it("error report", () => {
        const state = { error: false }
        const action = {
            type: C.ERROR_REPORT,
            error: true
        }
        const results = lyric(state, action)
        expect(results).toEqual({
            error: true
        })
    })
})
