import {EntitySpace} from '../entity/entity-space.js';
import {Metronome} from '../async/metronome.js';
import {AccountManager} from "../transport/account-manager.js";
import {ChunkManager} from "../transport/chunk-manager.js";

/**
 * Performs the game loop.
 */

export class Game {
    #metronome;
    #accountManager;
    #chunkManager;
    #playerSpace = new EntitySpace();
    #chunkSpace = new EntitySpace();
    #petSpace = new EntitySpace();

    /**
     * @param {StorageAdapter} accountStorageAdapter
     * @param {StorageAdapter} chunkStorageAdapter
     * @param {number} chunkSize
     * @param {number} milliseconds
     * @param {function(Game, Account): void} callback
     */

    constructor(accountStorageAdapter, chunkStorageAdapter, chunkSize, milliseconds, callback) {
        this.#accountManager = new AccountManager(accountStorageAdapter);
        this.#chunkManager = new ChunkManager(this.#chunkSpace, chunkStorageAdapter, chunkSize);

        this.#metronome = new Metronome(
            milliseconds,
            () => this.#accountManager.loadedAccounts.forEach(account => callback(this, account))
        );
    }

    get accountManager() {
        return this.#accountManager;
    }

    get chunkManager() {
        return this.#chunkManager;
    }

    /**
     * Stops the game.
     */

    stop() {
        this.#metronome.stop();
    }

    /**
     * Returns the entity space for players.
     * @return {EntitySpace}
     */

    get playerSpace() {
        return this.#playerSpace;
    }

    /**
     * Returns the entity space for chunks.
     * @return {EntitySpace}
     */

    get chunkSpace() {
        return this.#chunkSpace;
    }

    /**
     * Returns the entity space for pets.
     * @return {EntitySpace}
     */

    get petSpace() {
        return this.#petSpace;
    }
}