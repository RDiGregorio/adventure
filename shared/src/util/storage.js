import {jsonReplacer, jsonReviver} from './json.js';

const storage = new Map();

export class Storage {
    /**
     * @param {string} key
     * @return {Promise<boolean>}
     */

    async exists(key) {
        return storage.has(key);
    }

    /**
     * @param {string} key
     * @return {Promise<*>}
     */

    async load(key) {
        return JSON.parse(storage.get(key), jsonReviver);
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {Promise<void>}
     */

    async save(key, value) {
        storage.set(key, JSON.stringify(value, jsonReplacer));
    }
}