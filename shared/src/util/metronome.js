import {sleep} from "./async.js";

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
        this.#run(milliseconds, callback);
    }

    async #run(interval, callback) {
        const start = Date.now();

        for (let offset = 0; this.#running; offset += interval) {
            await sleep(Math.max(0, start - Date.now() + offset));
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