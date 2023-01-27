import {jsonReplacer, jsonReviver} from './json.js';
import {Queue} from './queue.js';

export class Storage {
    #queue = new Queue();
    #default;
    #exists;
    #load;
    #save;

    /**
     * @param {function(string): boolean|Promise<boolean>} exists
     * @param {function(string): *} load
     * @param {function(string, *): void|Promise<void>} save
     */

    constructor(exists = this.#defaultExists, load = this.#defaultLoad, save = this.#defaultSave) {
        this.#exists = exists;
        this.#load = load;
        this.#save = save;
    }

    #defaultExists(key) {
        this.#default ??= new Map();
        return this.#default.has(key);
    }

    #defaultLoad(key) {
        this.#default ??= new Map();
        return this.#default.get(key);
    }

    #defaultSave(key, value) {
        this.#default ??= new Map();
        this.#default.set(key, value);
    }

    /**
     * @param {string} key
     * @return {Promise<boolean>}
     */

    exists(key) {
        return this.#queue.add(() => this.#exists(key));
    }

    /**
     * @param {string} key
     * @return {Promise<*>}
     */

    load(key) {
        return this.#queue.add(() => JSON.parse(this.#load(key), jsonReviver));
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {Promise<void>}
     */

    save(key, value) {
        return this.#queue.add(() => this.#save(key, JSON.stringify(value, jsonReplacer)));
    }
}