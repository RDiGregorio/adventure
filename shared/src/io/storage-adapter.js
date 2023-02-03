/**
 * An abstract storage adapter.
 */

class StorageAdapter {
    #storage = new Map();

    /**
     * @param {string} key
     * @return {Promise<boolean>}
     */

    async exists(key) {
        return this.#storage.has(key);
    }

    /**
     * @param {string} key
     * @return {Promise<*>}
     */

    async load(key) {
        return this.#storage.get(key);
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {Promise<void>}
     */

    async save(key, value) {
        this.#storage.set(key, value);
    }
}