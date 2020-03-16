/* eslint-disable no-undef */
import C from "../renderer/actions/constant"
import { media } from "../renderer/reducers/index"

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
})
