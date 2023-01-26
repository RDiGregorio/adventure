import {Entity} from './entity.js';
import {Space} from '../util/space.js';

export class World {
    static #size = 100;
    static #worlds = new Map();
    #loaded = new Set();
    #spaces = new Map();
    #name;
    #storage;

    /**
     * @param {string} name
     * @param {Class} storage
     */

    constructor(name, storage = Storage) {
        if (World.#worlds.has(name)) return World.#worlds.get(name);
        World.#worlds.set(name, this);
        this.#name = name;
        this.#storage = storage;
    }

    #space(type) {
        if (!this.#spaces.has(type)) this.#spaces.set(type, new Space());
        return this.#spaces.get(type);
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
                this.#space(entity.type).add(entity, x, y);
    }

    /**
     * @param {string} type
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Entity[]}
     */

    search(type, x, y, width, height) {
        return this.#space(type).search(x, y, width, height);
    }

    async save(x, y) {
        const key = this.#storageKey(x, y);

        if (this.#loaded.delete(key)) {
            const entities = [];

            for (const space of this.#spaces.values())
                entities.push(...space.search(x, y, World.#size, World.#size));

            await this.#storage.save(key, entities);
        }
    }
}