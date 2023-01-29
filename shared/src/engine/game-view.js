import {GameObject} from './game-object.js';

export class GameView extends GameObject {
    #viewer;
    #chunkManager;

    /**
     * @param {Entity} viewer
     * @param {ChunkManager} chunkManager
     */

    constructor(viewer, chunkManager) {
        super();
        this.#viewer = viewer;
        this.#chunkManager = chunkManager;
    }

    async load() {
        const entities = new Map();

        for (let x = -1; x <= 1; x++)
            for (let y = -1; y <= 1; y++) {
                const size = this.#chunkManager.chunkSize;
                await this.#chunkManager.load(this.#viewer.world, x * size, y * size);

                this
                    .#chunkManager
                    .search(this.#viewer.world, x * size, y * size, size, size)
                    .forEach(entity => entities.set(entity.id, entity));
            }

        this.sync(entities);
    }
}