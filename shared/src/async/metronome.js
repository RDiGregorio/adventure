import {async} from './async.js';

/**
 * Periodically calls a function.
 */

export class Metronome {
    #running = true;

    /**
     * @param {number} milliseconds
     * @param {function(): void} callback
     */

    constructor(milliseconds, callback) {
        // The promise is ignored.

        this.#run(milliseconds, callback);
    }

    async #run(milliseconds, callback) {
        const start = Date.now();

        for (let offset = 0; this.#running; offset += milliseconds) {
            await async(start - Date.now() + offset);
            callback();
        }
    }

    /**
     * Stops the process.
     */

    stop() {
        this.#running = false;
    }
}