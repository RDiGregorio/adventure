import {Queue} from '../async/queue.js';

/**
 * Saves and loads chunks of entities.
 */

export class ChunkManager {
    #queue = new Queue();
    #loaded = new Map();
    #entitySpace;
    #storageAdapter;
    #chunkSize;
    #create;

    /**
     * @param {EntitySpace} entitySpace
     * @param {StorageAdapter} storageAdapter
     * @param {number} chunkSize
     * @param {function(number, number, number): Entity[]|Promise<Entity[]>} create
     */

    constructor(entitySpace, storageAdapter, chunkSize, create) {
        this.#entitySpace = entitySpace;
        this.#storageAdapter = storageAdapter;
        this.#chunkSize = chunkSize;
        this.#create = create;
    }

    /**
     * Returns the chunk size.
     * @return {number}
     */

    get chunkSize() {
        return this.#chunkSize;
    }

    /**
     * Returns the loaded chunk locations.
     * @return {number[][]}
     */

    get loadedChunkLocations() {
        return [...this.#loaded.values()].map(array => [...array]);
    }

    /**
     * Returns true if a chunk exists.
     * @param {string} world
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
     * Loads a chunk if it exists or creates it otherwise.
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
                : await this.#create(world, x, y);

            for (const entity of entities)
                this.#entitySpace.add(entity, entity.world, entity.x, entity.y);
        });
    }

    /**
     * Saves a chunk.
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {boolean} [unload = false]
     * @return {Promise<void>}
     */

    save(world, x, y, unload = false) {
        return this.#queue.add(async () => {
            const key = JSON.stringify([world, x, y]);
            if (!this.#loaded.has(key)) return;
            const entities = this.#entitySpace.search(world, x, y, this.#chunkSize, this.#chunkSize);
            await this.#storageAdapter.save(key, entities);
            if (!unload) return;
            this.#loaded.delete(key);
            entities.forEach(entity => this.#entitySpace.delete(entity));
        });
    }
}