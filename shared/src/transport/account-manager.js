import {Queue} from '../async/queue.js';

/**
 * Creates, loads, and saves player accounts.
 */

export class AccountManager {
    #queue = new Queue();
    #accounts = new Map();
    #storageAdapter;

    /**
     * @param {StorageAdapter} storageAdapter
     */

    constructor(storageAdapter) {
        this.#storageAdapter = storageAdapter;
    }

    /**
     * @return {Account[]}
     */

    get loadedAccounts() {
        return [...this.#accounts.values()];
    }

    /**
     * Loads a player account (creating it if needed).
     * @param {string} key
     * @param {function(string): Account|Promise<Account>} create
     * @return {Promise<*>}
     */

    load(key, create) {
        return this.#queue.add(async () => {
            if (!this.#accounts.has(key)) {
                const account = await this.#storageAdapter.load(key, () => create(key))
                await this.#storageAdapter.save(account);
                this.#accounts.set(key, account);
            }

            return this.#accounts.get(key);
        });

    }

    /**
     * Saves a loaded player account.
     * @param {string} key
     * @param {boolean} [unload = false]
     * @return {Promise<Account>}
     */

    async save(key, unload = false) {
        return this.#queue.add(async () => {
            if (this.#accounts.has(key)) await this.#storageAdapter.save(key, this.#accounts.get(key));
            if (unload) this.#accounts.delete(key);
        });
    }
}