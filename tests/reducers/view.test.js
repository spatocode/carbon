/* eslint-disable no-undef */
import C from "../../renderer/actions/constant"
import { view } from "../../renderer/reducers/index"

describe("view", () => {
    it("select view", () => {
        const state = { category: "Now Playing" }
        const action = {
            type: C.SELECT_VIEW,
            category: "Music"
        }
        const results = view(state, action)
        expect(results).toEqual({
            category: "Music"
        })
    })

    it("select settings tab", () => {
        const state = { settingsTab: "General" }
        const action = {
            type: C.SELECT_SETTINGS_TAB,
            tabItem: "Playback"
        }
        const results = view(state, action)
        expect(results).toEqual({
            settingsTab: "Playback"
        })
    })
})
