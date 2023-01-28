import {Entity} from './entity.js';
import {Space} from '../util/space.js';
import {Storage} from '../util/storage.js';
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
     * @return {Promise<boolean>}
     */

    exists(world, x, y, width, height) {
        return this.#queue.add(() => this.#storage.exists(this.#key(world, x, y, width, height)));
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Promise<void>}
     */

    load(world, x, y, width, height) {
        return this.#queue.add(async () => {
            const key = this.#key(world, x, y, width, height);

            if (this.#loaded.add(key))
                for (const entity of await this.#storage.load(key))
                    this.add(entity, entity.world, entity.x, entity.y);
        });
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
        return this.#queue.add(async () => {
            const key = this.#key(world, x, y, width, height);

            if (!this.#loaded.has(key) && await this.#storage.exists(this.#key(world, x, y, width, height))) return;
            const entities = this.search(world, x, y, width, height);
            await this.#storage.save(key, entities);

            if (unload) {
                this.#loaded.delete(key);
                entities.forEach(this.delete);
            }
        });
    }

    /**
     * @return {Map<number, Map<string, [number, number]>>}
     */

    toMap() {
        const result = new Map();

        for (const [key, value] of this.#spaces)
            result.set(key, value.toMap());

        return result;
    }
}