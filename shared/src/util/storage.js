import {jsonReplacer, jsonReviver} from './json.js';
import {Queue} from './queue.js';

export class Storage {
    #queue = new Queue();
    #database;

    Storage(database) {
        this.#database = database;
    }

    /**
     * @param {string} key
     * @return {Promise<boolean>}
     */

    exists(key) {
        return this.#queue.add(() => this.#database.exists(key));
    }

    /**
     * @param {string} key
     * @return {Promise<*>}
     */

    load(key) {
        return this.#queue.add(() => JSON.parse(this.#database.load(key), jsonReviver));
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {Promise<void>}
     */

    save(key, value) {
        return this.#queue.add(() => this.#database.save(key, JSON.stringify(value, jsonReplacer)));
    }
}