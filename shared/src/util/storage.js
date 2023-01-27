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
    #reviver;
    #replacer;

    /**
     * @param {function(string): Promise<boolean>} exists
     * @param {function(string): Promise<*>} load
     * @param {function(string, *): Promise<void>} save
     * @param {function(string, *): *} reviver
     * @param {function(string, *): *} replacer
     */

    constructor(exists, load, save, reviver, replacer) {
        this.#exists = exists;
        this.#load = load;
        this.#save = save;
        this.#reviver = reviver;
        this.#replacer = replacer;
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
        return this.#queue.add(() => JSON.parse(this.#load(key), this.#reviver));
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {Promise<void>}
     */

    save(key, value) {
        return this.#queue.add(() => this.#save(key, JSON.stringify(value, this.#replacer)));
    }
}