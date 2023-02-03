/**
 * Calls functions in order they are added.
 */

export class Queue {
    #promise = Promise.resolve();

    /**
     * Adds a function to the queue.
     * @param {function(): *} callback
     * @return {Promise<*>}
     */

    add(callback) {
        return this.#promise = this.#promise.then(() => callback(), error => {
            console.error(error);
            return callback();
        });
    }
}