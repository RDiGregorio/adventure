import {Space} from './space.js';

// TODO: for this, we really need a save manager first

class World {
    #callback;
    #space = new Space();

    /**
     * @param {function(number, number): WorldChunk} callback
     */

    constructor(callback) {
        this.#callback = callback;
    }

    // todo: multiple spaces for different types of entities?

    getChunk(x, y) {

    }

    #loadChunk(x, y) {

    }

    saveChunk(x, y) {
        //
    }
}

class WorldChunk {
    #world;

    constructor(world) {
        this.#world = world;
    }
}