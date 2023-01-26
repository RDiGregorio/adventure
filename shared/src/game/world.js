import {Space} from '../util/space.js';
import {global} from '../util/global.js';
import {jsonReplacer} from "../util/json.js";

// TODO: for this, we really need a save manager first
// there will be no "WorldChunk" object as terrain will be stored as entities
// this class mainly revolves around saving/loading entities

export class World {
    #keys = new Set();
    #space = new Space();
    #name;

    constructor(name) {
        this.#name = name;
    }

    #key(x, y) {
        return `${this.#name}.${x}.${y}`;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {function(number, number): Promise<Entity[]>} callback
     * @return {Promise<void>}
     */

    async load(x, y, callback) {
        const key = this.#key(x, y);
        if (!this.#keys.add(key)) return;

        if (await global.storage.exists(key)) {
            for (const entity of await global.storage.load(key)) {
                // TODO: add all
            }

            return;
        }

        await global.storage.save(key, JSON.stringify(await callback(x, y), jsonReplacer));
        await this.load(x, y, callback);
    }

    async unload(x, y) {
        //
    }
}