var app = { player: new Audio() }

/**
 * Stores a DOM media player in memory
 * @param {Object} player
 */
export function setPlayer (player) {
    app.player = player
}

/*
 * Retrieves a DOM media player from memory
 */
export function getPlayer () {
    return app.player
}
