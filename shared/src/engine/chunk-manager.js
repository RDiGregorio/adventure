import {Entity} from './entity.js';
import {Space} from '../util/space.js';
import {Storage} from '../util/storage.js';
import {Queue} from '../util/queue.js';

export class ChunkManager {
    #queue = new Queue();
    #loaded = new Map();
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

    /**
     * @return {number[][]}
     */

    get chunks() {
        return [...this.#loaded.values()].map(array => [...array]);
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
        return this.#queue.add(() => this.#storage.exists(JSON.stringify([world, x, y])));
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {function(): Entity[]} create
     * @return {Promise<void>}
     */

    load(world, x, y, create) {
        return this.#queue.add(async () => {
            const key = JSON.stringify([world, x, y]);
            if (this.#loaded.has(key)) return;
            this.#loaded.set(key, [world, x, y]);
            const entities = await this.#storage.exists(key) ? await this.#storage.load(key) : create();

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
            const key = JSON.stringify([world, x, y]);

            // todo: should this throw an error for bad state?

            if (!this.#loaded.has(key) && await this.#storage.exists(key)) return;
            const entities = this.search(world, x, y, this.#chunkSize, this.#chunkSize);
            await this.#storage.save(key, entities);

            if (unload) {
                this.#loaded.delete(key);
                entities.forEach(entity => this.delete(entity));
            }
        });
    }
}