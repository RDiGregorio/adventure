import {Queue} from '../async/queue.js';

/**
 * Saves and loads chunks of entities in an `EntitySpace` using a `StorageAdapter`.
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

    #load(world, x, y) {
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
     * Saves a loaded chunk. Does nothing if the chunk is not loaded.
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

    /**
     * Returns each entity in an adjacent chunk (loading or creating chunks as needed).
     * @param world
     * @param x
     * @param y
     * @return {Promise<Entity[]>}
     */

    async search(world, x, y) {
        const result = [];

        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {
                const chunk = {x: x + i * this.#chunkSize, y: y + j * this.#chunkSize};
                await this.#load(world, chunk.x, chunk.y);
                result.push(...this.#entitySpace.search(world, chunk.x, chunk.y, this.#chunkSize, this.#chunkSize));
            }

        return result;
    }
}