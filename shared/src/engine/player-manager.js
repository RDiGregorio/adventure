import {Queue} from '../util/queue.js';

// TODO: really need to think about this. probably want a space here, too.

class PlayerManager {
    #queue = new Queue();
    #loaded = new Map();
    #storageAdapter;
    #create;

    /**
     * @param {StorageAdapter} storageAdapter
     * @param {function(): Player} create
     */

    constructor(storageAdapter, create) {
        this.#storageAdapter = storageAdapter;
        this.#create = create;
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Player[]}
     */

    search(world, x, y, width, height) {
        return [];
    }
}