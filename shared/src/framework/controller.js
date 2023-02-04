// todo: this will handle the player manager and chunk manager
// should each player have a different controller?
// shoul this be like a session in TCO?

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