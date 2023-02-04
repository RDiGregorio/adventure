import {Queue} from '../async/queue.js';
import {Metronome} from '../async/metronome.js';

/**
 * Creates, loads, and saves spatial chunks of entities.
 */

export class ChunkManager {
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

    async #load(world, x, y) {
        const key = JSON.stringify([world, x, y]), exists = this.#loaded.has(key);
        this.#loaded.set(key, Date.now());

        if (!exists)
            for (const entity of await this.#storageAdapter.load(key, () => this.#create(world, x, y)))
                this.#entitySpace.add(entity, entity.world, entity.x, entity.y);
    }

    async #save(world, x, y, unload = false) {
        const key = JSON.stringify([world, x, y]);
        if (!this.#loaded.has(key)) return;
        const entities = this.#entitySpace.search(world, x, y, this.#chunkSize, this.#chunkSize);

        // fixme: this can flake:
        // chunk A is saved
        // monster walks from B to A
        // chunk B is saved

        await this.#storageAdapter.save(key, entities);

        if (!unload) return;
        this.#loaded.delete(key);
        entities.forEach(entity => this.#entitySpace.delete(entity));
    }

    /**
     * Loads each nearby chunk (creating chunks as needed).
     * @param {string} world
     * @param {number} x
     * @param {number} y
     * @return {Promise<void>}
     */

    async loadNearbyChunks(world, x, y) {
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++)
                await this.#load(world, x + i * this.#chunkSize, y + j * this.#chunkSize);
    }

    /**
     * Saves each loaded chunk.
     * @return {Promise<void>}
     */

    async save() {
        for (const key of this.#loaded.keys())
            await this.#save(...JSON.parse(key));
    }
}