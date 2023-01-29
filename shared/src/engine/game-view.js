import {GameObject} from './game-object.js';

class GameView extends GameObject {
    #player;
    #chunkManager;

    /**
     * @param {Entity} player
     * @param {ChunkManager} chunkManager
     */

    constructor(player, chunkManager) {
        super();
        this.#player = player;
        this.#chunkManager = chunkManager;
    }


    #replaceWith(left, right) {
        [...left.keys()].filter(key => !right.has(key)).forEach(key => left.delete(key));
        [...right].forEach(entry => left.set(...entry));
    }

    async update() {
        //
    }
}