/* eslint-disable no-undef */
const Application = require("spectron").Application
const electron = require("electron")
const path = require("path")

const app = new Application({
    path: electron,
    args: [path.join(__dirname, "..")]
})

describe("Application", () => {
    jest.setTimeout(30000)

    beforeEach(() => {
        return app.start()
    })

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop()
        }
    })

    test("shows one window on start", done => {
        return app.client.getWindowCount()
            .then(count => {
                expect(1).toEqual(count)
                done()
            })
    })

    test("shows title", () => {
        return app.client.getTitle()
            .then(title => {
                expect("Carbon Player").toEqual(title)
            })
    })

    test("has a pre-defined background color", () => {
        return app.browserWindow.getBackgroundColor()
            .then(bgColor => {
                expect("#BEBDBD").toEqual(bgColor)
            })
    })
})
