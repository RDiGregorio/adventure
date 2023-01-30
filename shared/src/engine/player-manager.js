class PlayerManager {
    #storage;
    #create;

    /**
     * @param {Storage} storage
     * @param {function(): Player} create
     */

    constructor(storage, create) {
        this.#storage = storage;
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