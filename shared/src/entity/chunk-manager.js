import {Queue} from '../async/queue.js';
import {Metronome} from "../async/metronome.js";

/**
 * Creates, loads, saves, and searches spatial chunks of entities.
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
     * Returns each entity in each adjacent chunk (creating and loading chunks as needed).
     * @param {string} world
     * @param {number} x
     * @param {number} y
     * @return {Promise<Entity[]>}
     */

    async search(world, x, y) {
        console.log(this.#entitySpace.toArray());

        const result = [];

        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {
                const chunk = {x: x + i * this.#chunkSize, y: y + j * this.#chunkSize};
                await this.#load(world, chunk.x, chunk.y);
                result.push(...this.#entitySpace.search(world, chunk.x, chunk.y, this.#chunkSize, this.#chunkSize));
            }

        return result;
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