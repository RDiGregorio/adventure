import {Entity} from './entity.js';
import {Space} from '../util/space.js';
import {Storage} from '../util/storage.js';
import {Queue} from '../util/queue.js';

// todo: handle periodic saves/loads, possibly thought "storage"?
// also need a way to "save all"

export class ChunkManager {
    #queue = new Queue();
    #loaded = new Set();
    #spaces = new Map();
    #storage;
    #chunkSize;

    /**
     * @param {Storage} storage
     * @param {number} chunkSize
     */

    constructor(storage, chunkSize) {
        this.#storage = storage;
        this.#chunkSize = chunkSize;
    }

    #key(world, x, y) {
        return `world/${world} ${x} ${y}`;
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
     * @return {Promise<boolean>}
     */

    exists(world, x, y) {
        return this.#queue.add(() => this.#storage.exists(this.#key(world, x, y)));
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {function(number, number, number): Entity[]} create
     * @return {Promise<void>}
     */

    load(world, x, y, create) {
        return this.#queue.add(async () => {
            const key = this.#key(world, x, y);
            if (!this.#loaded.add(key)) return;
            const entities = await this.#storage.exists(key) ? await this.#storage.load(key) : create(world, x, y);

            for (const entity of entities)
                this.add(entity, entity.world, entity.x, entity.y);
        });
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {boolean} unload
     * @return {Promise<void>}
     */

    save(world, x, y, unload = false) {
        return this.#queue.add(async () => {
            const key = this.#key(world, x, y);

            if (!this.#loaded.has(key) && await this.#storage.exists(this.#key(world, x, y))) return;
            const entities = this.search(world, x, y, this.#chunkSize, this.#chunkSize);
            await this.#storage.save(key, entities);

            if (unload) {
                this.#loaded.delete(key);
                entities.forEach(this.delete);
            }
        });
    }
}