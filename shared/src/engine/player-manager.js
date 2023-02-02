import {Queue} from '../util/queue.js';
import {Space} from "../util/space.js";

// TODO: really need to think about this. probably want a space here, too.

class PlayerManager {
    #queue = new Queue();
    #loaded = new Map();
    #spaces = new Map();
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

    /**
     * @param {Player} player
     * @param {number} world
     * @param {number} x
     * @param {number} y
     */

    add(player, world, x, y) {
        // this.delete(entity);
        player.entity.set('world', world);
        player.entity.set('location', [x, y]);
        if (!this.#spaces.has(world)) this.#spaces.set(world, new Space(entity => entity.id));
        this.#spaces.get(world).add(entity, x, y);
    }
}