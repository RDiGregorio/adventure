export class GameEvent {
    #type;
    #path;
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
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static jsonReplacer(key, value) {
        return value instanceof GameEvent
            ? {class: value.constructor.name, type: value.type, path: value.path, value: value.value}
            : value;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static jsonReviver(key, value) {
        return value?.class === 'GameEvent' ? new GameEvent(value.type, value.path, value.value) : value;
    }

    /**
     * @param {string[]} array
     * @return {boolean}
     */

    pathMatches(array) {
        if (this.#path.length !== array.length) return false;
        return this.#path.every((value, index) => array[index] === value || array[index] === '*');
    }
}