// todo: this will handle the player manager and chunk manager
// should each player have a different controller?

/**
 * A game controller.
 */

export class Controller {
    #playerManager;
    #chunkManager;

    constructor(playerManager, chunkManager) {
        this.#playerManager = playerManager;
        this.#chunkManager = chunkManager;
    }
}