export class Queue {
    #promise = Promise.resolve();

    /**
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