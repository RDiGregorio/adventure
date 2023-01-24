export class GameEvent {
    #path;
    #type;
    #value;

    /**
     * @param {string} type
     * @param {string[]} path
     * @param {*} value
     */

    constructor(type, path, value) {
        this.#type = type;
        this.#path = [...path];
        this.#value = value;
    }

    /**
     * @return {string[]}
     */

    get path() {
        return [...this.#path];
    }

    /**
     * @return {string}
     */

    get type() {
        return this.#type;
    }

    /**
     * @return {*}
     */

    get value() {
        return this.#value;
    }
}