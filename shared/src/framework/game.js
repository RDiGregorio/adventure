import {Model} from './model.js';
import {EntitySpace} from '../entity/entity-space.js';
import {Metronome} from "../async/metronome.js";

export class Game {
    #model = new Model(new EntitySpace(), new EntitySpace(), new EntitySpace());
    #accountManager;
    #chunkManager;
    #metronome;

    constructor(accountManager, chunkManager, milliseconds) {
        this.#accountManager = accountManager;
        this.#chunkManager = chunkManager;

        this.#metronome = new Metronome(milliseconds, () => {
            // TODO: game loop (run each account/player)
        });
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