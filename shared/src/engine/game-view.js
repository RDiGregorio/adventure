import {GameObject} from './game-object.js';

export class GameView extends GameObject {
    #viewer;
    #chunkManager;
    #playerManager;

    /**
     * @param {Entity} viewer
     * @param {ChunkManager} chunkManager
     * @param {PlayerManager} playerManager
     */

    constructor(viewer, chunkManager, playerManager) {
        super();
        this.#viewer = viewer;
        this.#chunkManager = chunkManager;
        this.#playerManager = playerManager;
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

                this
                    .#playerManager
                    .search(this.#viewer.world, x * size, y * size, size, size)
                    .map(player => player.entity)
                    .forEach(entity => entities.set(entity.id, entity));
            }

        this.sync(entities);
    }
}