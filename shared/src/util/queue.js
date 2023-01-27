export class Queue {
    #promise = Promise.resolve(4);

    /**
     * @param {function(): *} callback
     * @return {Promise<void>}
     */

    add(callback) {
        return this.#promise = this.#promise.finally(callback);
    }
}

const queue = new Queue();