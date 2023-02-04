import {Queue} from '../async/queue.js';
import {Metronome} from "../async/metronome.js";

/**
 * Creates, loads, and saves spatial chunks of entities.
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
     * @param {number} saveMilliseconds
     * @param {function(string, number, number): Entity[]|Promise<Entity[]>} create
     */

    constructor(entitySpace, storageAdapter, chunkSize, saveMilliseconds, create) {
        this.#entitySpace = entitySpace;
        this.#storageAdapter = storageAdapter;
        this.#chunkSize = chunkSize;
        this.#create = create;

        new Metronome(saveMilliseconds, () => {
                for (const [key, value] of this.#loaded) {
                    const [world, x, y] = JSON.parse(key);

                    // The promise is ignored.

                    this.#save(world, x, y, value + saveMilliseconds >= Date.now());
                }
            }
        );
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

    #save(world, x, y, unload = false) {
        return this.#queue.add(async () => {
            const key = JSON.stringify([world, x, y]), size = this.#chunkSize;
            if (!this.#loaded.has(key)) return;

            // Entities in all loaded adjacent chunks are saved (for redundancy to prevent losses from crashing).

            await this
                .#storageAdapter
                .save(key, this.#entitySpace.search(world, x - size, y - size, size * 3, size * 3));

            if (!unload) return;
            this.#loaded.delete(key);

            // Only entities in the specified chunk are deleted on unload.

            this
                .#entitySpace
                .search(world, x, y, size, size)
                .forEach(entity => this.#entitySpace.delete(entity));
        });
    }

    /**
     * Loads each adjacent chunk (creating chunks as needed).
     * @param {string} world
     * @param {number} x
     * @param {number} y
     * @return {Promise<void>}
     */

    async load(world, x, y) {
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++)
                await this.#load(world, x + i * this.#chunkSize, y + j * this.#chunkSize);
    }

    /**
     * Saves and unloads each loaded chunk.
     * @return {Promise<void>}
     */

    async unload() {
        for (const key of this.#loaded.keys())
            await this.#save(...JSON.parse(key));
    }
}