/**
 * An abstract storage adapter. Implemented for testing using a map.
 */

export class StorageAdapter {
    #storage = new Map();

    /**
     * Returns true if the entry exists.
     * @param {*} key
     * @return {Promise<boolean>}
     */

    async exists(key) {
        return this.#storage.has(key);
    }

    /**
     * Loads the entry (creating it if it does not exist).
     * @param {*} key
     * @param {function(): *} create
     * @return {Promise<*>}
     */

    async load(key, create) {
        return this.#storage.has(key) ? this.#storage.get(key) : await create();
    }

    /**
     * Saves the entry.
     * @param {*} key
     * @param {*} value
     * @return {Promise<void>}
     */

    async save(key, value) {
        this.#storage.set(key, value);
    }
}