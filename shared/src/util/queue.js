export class Queue {
    #promise = Promise.resolve();

    /**
     * @param {function(): void} callback
     */

    add(callback) {
        return this.#promise = this.#promise.finally(callback);
    }
}