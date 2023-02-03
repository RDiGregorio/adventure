import {Entity} from './entity.js';
import {Space} from '../util/space.js';
import {StorageAdapter} from '../util/storage-adapter.js';
import {Queue} from '../async/queue.js';

export class ChunkManager {
    #queue = new Queue();
    #loaded = new Map();
    #spaces = new Map();
    #chunkSize;
    #storageAdapter;
    #create;

    /**
     * @param {number} chunkSize
     * @param {StorageAdapter} storageAdapter
     * @param {function(number, number, number): Entity[]} create
     */

    constructor(chunkSize, storageAdapter, create) {
        this.#chunkSize = chunkSize;
        this.#storageAdapter = storageAdapter;
        this.#create = create;
    }

    /**
     * @return {number}
     */

    get chunkSize() {
        return this.#chunkSize;
    }

    /**
     * @return {number[][]}
     */

    get loadedChunkLocations() {
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
        return this.#queue.add(() => {
            const key = JSON.stringify([world, x, y]);
            return this.#loaded.has(key) || this.#storageAdapter.exists(key);
        });
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @return {Promise<void>}
     */

    load(world, x, y) {
        return this.#queue.add(async () => {
            const key = JSON.stringify([world, x, y]);
            if (this.#loaded.has(key)) return;
            this.#loaded.set(key, [world, x, y]);

            const entities = await this.#storageAdapter.exists(key)
                ? await this.#storageAdapter.load(key)
                : this.#create(world, x, y);

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
            if (!this.#loaded.has(key)) return;
            const entities = this.search(world, x, y, this.#chunkSize, this.#chunkSize);
            await this.#storageAdapter.save(key, entities);
            if (!unload) return;
            this.#loaded.delete(key);
            entities.forEach(entity => this.delete(entity));
        });
    }
}