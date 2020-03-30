var app = { player: new Audio() }

/*
 * Stores a DOM player to memory
 */
export function setPlayer (player) {
    player.s = player
}

/*
 * Retrieves a DOM player to memory
 */
export function getPlayer () {
    return app.player
}
