import {Entity} from './entity.js';
import {Space} from '../util/space.js';
import {mockExists, mockLoad, mockSave, Storage} from '../util/storage.js';
import {jsonReplacer, jsonReviver} from '../util/json.js';
import {Queue} from '../util/queue.js';

export class EntityManager {
    #queue = new Queue();
    #loaded = new Set();
    #spaces = new Map();
    #storage;

    /**
     * @param {Storage} storage
     */

    constructor(storage) {
        this.#storage = storage;
    }

    #key(world, x, y, width, height) {
        return `world/${world} ${x} ${y} ${width} ${height}`;
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Entity[]}
     */

    search(world, x, y, width, height) {
        return this.#spaces.get(world)?.search(x, y, width, height) ?? [];
    }

    /**
     * @param {Entity} entity
     * @param {number} world
     * @param {number} x
     * @param {number} y
     */

    add(entity, world, x, y) {
        this.delete(entity);
        entity.set('world', world);
        entity.set('location', [x, y]);
        if (!this.#spaces.has(world)) this.#spaces.set(world, new Space(entity => entity.id));
        this.#spaces.get(world).add(entity, x, y);
    }

    /**
     * @param {Entity} entity
     */

    delete(entity) {
        this.#spaces.get(entity.get('world'))?.delete(entity);
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Promise<void>}
     */

    async load(world, x, y, width, height) {
        const key = this.#key(world, x, y, width, height);
        if (this.#loaded.add(key) && await this.#storage.exists(key))
            for (const entity of await this.#storage.load(key))
                this.add(entity, entity.world, entity.x, entity.y);
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {boolean} unload
     * @return {Promise<void>}
     */

    async save(world, x, y, width, height, unload = false) {
        const key = this.#key(world, x, y, width, height), entities = this.search(world, x, y, width, height);
        await this.#storage.save(key, entities);
        if (unload) entities.forEach(this.delete);
    }
}