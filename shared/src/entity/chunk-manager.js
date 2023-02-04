import {Queue} from '../async/queue.js';

/**
 * Creates, saves, loads, and searches chunks of entities.
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
     * @param {function(string, number, number): Entity[]|Promise<Entity[]>} create
     */

    constructor(entitySpace, storageAdapter, chunkSize, create) {
        this.#entitySpace = entitySpace;
        this.#storageAdapter = storageAdapter;
        this.#chunkSize = chunkSize;
        this.#create = create;
    }

    /**
     * Returns a map from loaded chunk locations (world, x, and y) to the last time that chunk was searched.
     * @return {Map<[string, number, number], number>}
     */

    get chunkSearchDates() {
        return [...this.#loaded].reduce((result, entry) => result.set(JSON.parse(entry[0]), entry[1]), new Map());
    }

    #load(world, x, y) {
        return this.#queue.add(async () => {
            const key = JSON.stringify([world, x, y]), exists = this.#loaded.has(key);
            this.#loaded.set(key, Date.now());
            if (exists) return;

            const entities = await this.#storageAdapter.exists(key)
                ? await this.#storageAdapter.load(key)
                : await this.#create(world, x, y);

            for (const entity of entities)
                this.#entitySpace.add(entity, entity.world, entity.x, entity.y);
        });
    }

    /**
     * Saves a loaded chunk. Does nothing if the chunk is not loaded.
     * @param {string} world
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
     * Returns each entity in each adjacent chunk (loading or creating chunks as needed). Updates `chunkSearchDates` for
     * each adjacent chunk.
     * @param {string} world
     * @param {number} x
     * @param {number} y
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