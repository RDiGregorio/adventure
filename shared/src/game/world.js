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
        return `${world} ${x} ${y} ${width} ${height}`;
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Entity[]}
     */

    static search(world, x, y, width, height) {
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

    save(world, x, y, width, height, unload = false) {

    }
}

export class World2 {
    static #size = 100;
    static storage = new Storage();
    static #worlds = new Map();
    #loaded = new Set();
    #space = new Space(entity => entity.id);
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

    add(entity) {
        this.#space.add(entity, entity.x, entity.y);
    }

    /**
     * @param {Entity} entity
     */

    delete(entity) {
        this.#space.delete(entity);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {Promise<void>}
     */

    async load(x, y) {
        const key = this.#storageKey(x, y);

        // todo: this is actually super buggy, and i'll need a queue here, too

        if (this.#loaded.add(key) && await World.storage.exists(key)) for (const entity of await World.storage.load(key)) this.#space.add(entity, entity.x, entity.y);
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
        // todo: probably shouldn't save players...

        const key = this.#storageKey(x, y);
        await World.storage.save(key, this.search(x, y, World.#size, World.#size));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {Promise<void>}
     */

    async unload(x, y) {
        // todo: should i use another queue here?

        const key = this.#storageKey(x, y);
        if (!this.#loaded.has(key)) return;
        await this.save(x, y);

        // if (!this.#loaded.delete(key)) return;
        this.#space.search(x, y, World.#size, World.#size).forEach(this.delete);
    }
}