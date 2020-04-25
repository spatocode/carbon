/* eslint-disable no-undef */
import C from "../../renderer/actions/constant"
import { mode } from "../../renderer/reducers/index"

describe("mode", () => {
    it("night mode", () => {
        const state = { night: false }
        const action = {
            type: C.SELECT_MODE,
            night: true
        }
        const results = mode(state, action)
        expect(results).toEqual({
            night: true
        })
    })
})
