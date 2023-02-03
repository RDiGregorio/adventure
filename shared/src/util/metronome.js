import {sleep} from "./async.js";

// TODO: document this

export class Metronome {
    #running = true;

    constructor(interval, callback) {
        this.#run(interval, callback);
    }

    async #run(interval, callback) {
        const start = Date.now();

        for (let offset = 0; this.#running; offset += interval) {
            await sleep(Math.max(0, start - Date.now() + offset));
            callback();
        }
    }

    stop() {
        this.#running = false;
    }
}