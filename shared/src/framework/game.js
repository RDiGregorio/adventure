import {Model} from './model.js';
import {EntitySpace} from '../entity/entity-space.js';
import {Metronome} from '../async/metronome.js';
import {AccountManager} from "../transport/account-manager.js";
import {ChunkManager} from "../transport/chunk-manager.js";

/**
 * Performs the game loop.
 */

export class Game {
    #model;
    #accountManager;
    #chunkManager;
    #metronome;

    /**
     * @param {StorageAdapter} accountStorageAdapter
     * @param {StorageAdapter} chunkStorageAdapter
     * @param {number} chunkSize
     * @param {number} milliseconds
     * @param {function(Game, Account): void} callback
     */

    constructor(accountStorageAdapter, chunkStorageAdapter, chunkSize, milliseconds, callback) {
        this.#model = new Model(new EntitySpace(), new EntitySpace(), new EntitySpace());
        this.#accountManager = new AccountManager(accountStorageAdapter);
        this.#chunkManager = new ChunkManager(this.#model.chunkSpace, chunkStorageAdapter, chunkSize);

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

    get model() {
        return this.#model;
    }

    stop() {
        this.#metronome.stop();
    }
}