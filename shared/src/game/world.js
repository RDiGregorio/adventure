import {Entity} from './entity.js';
import {Space} from '../util/space.js';
import {Storage} from '../util/storage.js';

export class World {
    static #size = 100;
    static storage = new Storage();
    static #worlds = new Map();
    #loaded = new Set();
    #space = new Space();
    #key;

    /**
     * @return {Iterable<[number,number]>}
     */

    get points() {
        return this.#space.points;
    }

    /**
     * @param {string} key
     * @return {World}
     */

    static get(key) {
        if (!World.#worlds.has(key)) {
            const world = new World();
            World.#worlds.set(world.#key = key, world);
        }

        return World.#worlds.get(key);
    }

    #storageKey(x, y) {
        return `world/${this.#key} ${x} ${y}`;
    }

    /**
     * @param {Entity} entity
     */

    update(entity) {
        entity.worldKey === this.#key ? this.#space.add(entity, entity.x, entity.y) : this.#space.delete(entity);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {Promise<void>}
     */

    async load(x, y) {
        const key = this.#storageKey(x, y);

        if (this.#loaded.add(key) && await World.storage.exists(key))
            for (const entity of await World.storage.load(key))
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

    /**
     * @param {number} x
     * @param {number} y
     * @return {Promise<void>}
     */

    async save(x, y) {
        const key = this.#storageKey(x, y);
        if (this.#loaded.delete(key)) await World.storage.save(key, this.#space.search(x, y, World.#size, World.#size));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {Promise<void>}
     */

    async unload(x, y) {
        // todo
    }
}