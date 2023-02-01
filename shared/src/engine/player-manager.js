class PlayerManager {
    #storageAdapter;
    #create;

    /**
     * @param {StorageAdapter} storageAdapter
     * @param {function(): Player} create
     */

    constructor(storageAdapter, create) {
        this.#storageAdapter = storageAdapter;
        this.#create = create;
    }

    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Player[]}
     */

    search(world, x, y, width, height) {
        return [];
    }
}