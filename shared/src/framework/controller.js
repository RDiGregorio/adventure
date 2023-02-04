// todo: this will handle the player manager and chunk manager

export class Controller {
    #playerManager;
    #chunkManager;

    constructor(playerManager, chunkManager) {
        this.#playerManager = playerManager;
        this.#chunkManager = chunkManager;
    }
}