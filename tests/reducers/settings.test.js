/* eslint-disable no-undef */
import C from "../../renderer/actions/constant"
import { settings } from "../../renderer/reducers/index"

describe("settings", () => {
    it("visible column", () => {
        const state = {
            visibleColumn: {
                track: true,
                title: true
            }
        }
        const action = {
            type: C.VISIBLE_COLUMN,
            item: { title: false }
        }
        const results = settings(state, action)
        expect(results).toEqual({
            visibleColumn: {
                track: true,
                title: false
            }
        })
    })

    it("download and stream", () => {
        const state = { downloadAndStream: false }
        const action = {
            type: C.DOWNLOAD_AND_STREAM,
            checked: true
        }
        const results = settings(state, action)
        expect(results).toEqual({
            downloadAndStream: true
        })
    })
})
