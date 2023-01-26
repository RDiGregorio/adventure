import {jsonReplacer, jsonReviver} from './json.js';

export class Storage {
    static #map = new Map();

    /**
     * @param {string} key
     * @return {Promise<boolean>}
     */

    static async exists(key) {
        return this.#map.has(key);
    }

    /**
     * @param {string} key
     * @return {Promise<*>}
     */

    static async load(key) {
        return JSON.parse(this.#map.get(key), jsonReviver);
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {Promise<void>}
     */

    static async save(key, value) {
        this.#map.set(key, JSON.stringify(value, jsonReplacer));
    }
}