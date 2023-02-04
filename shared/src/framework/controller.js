// todo: this will handle the player manager and chunk manager
// should each player have a different controller?
// should this be like a session in TCO? should it take in a 'game' object?
// where is the game loop?

/**
 * A game controller. Each player in a game should have a different game controller.
 */

export class Controller {
    #playerManager;
    #chunkManager;

    constructor(playerManager, chunkManager) {
        this.#playerManager = playerManager;
        this.#chunkManager = chunkManager;
    }
}