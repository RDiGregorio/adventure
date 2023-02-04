/**
 * An abstract storage adapter. Implemented for testing using a map.
 */

class StorageAdapter {
    #storage = new Map();

    /**
     * @param {*} key
     * @return {Promise<boolean>}
     */

    async exists(key) {
        return this.#storage.has(key);
    }

    /**
     * @param {*} key
     * @return {Promise<*>}
     */

    async load(key) {
        return this.#storage.get(key);
    }

    /**
     * @param {*} key
     * @param {*} value
     * @return {Promise<void>}
     */

    async save(key, value) {
        this.#storage.set(key, value);
    }
}