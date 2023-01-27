import {jsonReplacer, jsonReviver} from './json.js';
import {Queue} from './queue.js';

const map = new Map();

/**
 * @param {string} key
 * @return {Promise<boolean>}
 */

export async function mockExists(key) {
    return map.has(key);
}

/**
 * @param {string} key
 * @return {Promise<*>}
 */

export async function mockLoad(key) {
    return map.get(key);
}

/**
 * @param {string} key
 * @param {*} value
 * @return {Promise<void>}
 */

export async function mockSave(key, value) {
    map.set(key, value);
}

export class Storage {
    #queue = new Queue();
    #exists;
    #load;
    #save;

    /**
     * @param {function(string): Promise<boolean>} exists
     * @param {function(string): Promise<*>} load
     * @param {function(string, *): Promise<void>} save
     */

    constructor(exists, load, save) {
        this.#exists = exists;
        this.#load = load;
        this.#save = save;
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