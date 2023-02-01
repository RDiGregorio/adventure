import {Queue} from './queue.js';

export const mockDatabase = new Map();

/**
 * @param {string} location
 * @param {string} key
 * @return {Promise<boolean>}
 */

export async function mockExists(location, key) {
    return mockDatabase.get(location)?.has(key) ?? false;
}

/**
 * @param {string} location
 * @param {string} key
 * @return {Promise<*>}
 */

export async function mockLoad(location, key) {
    return mockDatabase.get(location)?.get(key);
}

/**
 * @param {string} location
 * @param {string} key
 * @param {*} value
 * @return {Promise<void>}
 */

export async function mockSave(location, key, value) {
    if (!mockDatabase.has(location)) mockDatabase.set(location, new Map());
    mockDatabase.get(location).set(key, value);
}

export class StorageAdapter {
    #queue = new Queue();
    #location;
    #exists;
    #load;
    #save;
    #reviver;
    #replacer;

    /**
     * @param {string} location
     * @param {function(string, string): Promise<boolean>} exists
     * @param {function(string, string): Promise<*>} load
     * @param {function(string, string, *): Promise<void>} save
     * @param {function(string, *): *} reviver
     * @param {function(string, *): *} replacer
     */

    constructor(location, exists, load, save, reviver, replacer) {
        this.#location = location;
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
        return this.#queue.add(() => this.#exists(this.#location, key));
    }

    /**
     * @param {string} key
     * @return {Promise<*>}
     */

    load(key) {
        return this.#queue.add(async () => JSON.parse(await this.#load(this.#location, key), this.#reviver));
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {Promise<void>}
     */

    save(key, value) {
        return this.#queue.add(() => this.#save(this.#location, key, JSON.stringify(value, this.#replacer)));
    }
}