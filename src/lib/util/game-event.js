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

    /**
     * @param {string[]} array
     * @return {boolean}
     */

    pathMatches(array) {
        if (this.#path.length !== array.length) return false;
        return this.#path.every((value, index) => array[index] === value || array[index] === '*');
    }

    /**
     * @return {string}
     */

    toString() {
        // TODO: need to be able to encode game objects
        return super.toString();
    }
}