import {Queue} from '../async/queue.js';

/**
 * Creates, loads, and saves spatial chunks of entities.
 */

export class ChunkManager {
    #queue = new Queue();
    #loaded = new Map();
    #entitySpace;
    #storageAdapter;
    #chunkSize;

    /**
     * @param {EntitySpace} entitySpace
     * @param {StorageAdapter} storageAdapter
     * @param {number} chunkSize
     */

    constructor(entitySpace, storageAdapter, chunkSize) {
        this.#entitySpace = entitySpace;
        this.#storageAdapter = storageAdapter;
        this.#chunkSize = chunkSize;
    }

    async #load(world, x, y, create) {
        const key = JSON.stringify([world, x, y]);

        if (!this.#loaded.has(key))
            for (const entity of await this.#storageAdapter.load(key, () => create(world, x, y)))
                this.#entitySpace.add(entity, entity.world, entity.x, entity.y);

        this.#loaded.set(key, 0);
    }

    #save(world, x, y) {
        const key = JSON.stringify([world, x, y]);
        if (!this.#loaded.has(key)) return;
        const entities = this.#entitySpace.search(world, x, y, this.#chunkSize, this.#chunkSize);
        this.#loaded.set(key, this.#loaded.get(key) + 1);

        // Unused chunks are unloaded.

        if (this.#loaded.get(key) > 1) {
            this.#loaded.delete(key);
            entities.forEach(entity => this.#entitySpace.delete(entity));
        }

        // The promise is ignored.

        this.#storageAdapter.save(key, entities);
    }

    /**
     * Loads each nearby chunk that is not already loaded. Chunks that do not exist are created.
     * @param {string} world
     * @param {number} x
     * @param {number} y
     * @param {function(string, number, number): Entity[]|Promise<Entity[]>} create
     * @return {Promise<void>}
     */

    loadNearbyChunks(world, x, y, create) {
        return this.#queue.add(async () => {
            for (let i = -1; i <= 1; i++)
                for (let j = -1; j <= 1; j++)
                    await this.#load(world, x + i * this.#chunkSize, y + j * this.#chunkSize, create);
        });
    }

    /**
     * Saves each loaded chunk. Unused chunks are unloaded.
     * @return {Promise<void>}
     */

    async save() {
        return this.#queue.add(() => [...this.#loaded.keys()].forEach(key => this.#save(...JSON.parse(key))));
    }
}