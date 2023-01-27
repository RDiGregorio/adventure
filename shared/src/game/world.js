import {GameObject} from './game-object.js';
import {Entity} from './entity.js';
import {Space} from '../util/space.js';
import {Storage} from '../util/storage.js';

export class World {
    static #size = 100;
    static #worlds = new Map();
    #entities = new GameObject()
    #loaded = new Set();
    #space = new Space();
    #name;
    #storage;

    /**
     * @param {string} name
     * @param {Storage} storage
     */

    constructor(name, storage = new Storage()) {
        if (World.#worlds.has(name)) return World.#worlds.get(name);
        World.#worlds.set(name, this);
        this.#name = name;
        this.#storage = storage;
    }

    #storageKey(x, y) {
        return `world/${this.#name} ${x} ${y}`;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {function(number, number): Promise<Entity[]>} callback
     * @return {Promise<void>}
     */

    async load(x, y, callback) {
        const key = this.#storageKey(x, y);

        if (this.#loaded.add(key) && await this.#storage.exists(key))
            for (const entity of await this.#storage.load(key))
                this.#space.add(entity, x, y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Entity[]}
     */

    search(x, y, width, height) {
        return this.#space.search(x, y, width, height);
    }

    async save(x, y) {
        const key = this.#storageKey(x, y);
        if (this.#loaded.delete(key)) await this.#storage.save(key, this.#space.search(x, y, World.#size, World.#size));
    }
}