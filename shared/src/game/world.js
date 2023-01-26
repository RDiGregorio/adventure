import {Entity} from './entity.js';
import {Space} from '../util/space.js';
import {global} from '../util/global.js';
import {jsonReplacer} from '../util/json.js';

// TODO: for this, we really need a save manager first
// there will be no "WorldChunk" object as terrain will be stored as entities
// this class mainly revolves around saving/loading entities
// TODO: this needs a search function next (that also takes in type)

export class World {
    #keys = new Set();
    #spaces = new Map();
    #name;
    #size;

    constructor(name, size = 100) {
        this.#name = name;
        this.#size = size;
    }

    #key(x, y) {
        return `${this.#name}.${x}.${y}`;
    }

    #space(type) {
        if (!this.#spaces.has(type)) this.#spaces.set(type, new Space());
        return this.#spaces.get(type);
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
            for (const entity of await global.storage.load(key))
                this.#space(entity.type).add(entity, x, y);

            return;
        }

        await global.storage.save(key, JSON.stringify(await callback(x, y), jsonReplacer));
        await this.load(x, y, callback);
    }

    search(type, x, y, width, height) {
        return this.#space(type).search(x, y, width, height);
    }

    async unload(x, y) {
        //
    }
}