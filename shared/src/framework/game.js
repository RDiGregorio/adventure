import {Model} from './model.js';
import {EntitySpace} from '../entity/entity-space.js';
import {Metronome} from '../async/metronome.js';

/**
 * Performs the game loop.
 */

export class Game {
    #model = new Model(new EntitySpace(), new EntitySpace(), new EntitySpace());
    #accountManager;
    #chunkManager;
    #metronome;

    /**
     * @param {AccountManager} accountManager
     * @param {ChunkManager} chunkManager
     * @param {number} milliseconds
     * @param {function(Game, Account): void} callback
     */

    constructor(accountManager, chunkManager, milliseconds, callback) {
        this.#accountManager = accountManager;
        this.#chunkManager = chunkManager;

        this.#metronome = new Metronome(
            milliseconds,
            () => accountManager.loadedAccounts.forEach(account => callback(this, account))
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