/**
 * An event for a `GameObject`.
 */

export class MapEvent {
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
     * Returns a path to the event source.
     * @return {string[]}
     */

    get path() {
        return [...this.#path];
    }

    /**
     * Returns the event type.
     * @return {string}
     */

    get type() {
        return this.#type;
    }

    /**
     * Returns the event value.
     * @return {*}
     */

    get value() {
        return this.#value;
    }

    /**
     * A replacer for ending a `GameEvent` with `JSON.stringify`.
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
     * A reviver for decoding a `GameEvent` with `JSON.parse`.
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static jsonReviver(key, value) {
        return value?.class === 'GameEvent' ? new GameEvent(value.type, value.path, value.value) : value;
    }

    /**
     * TODO: move this somewhere else
     * @param {string[]} array
     * @return {boolean}
     */

    pathMatches(array) {
        if (this.#path.length !== array.length) return false;
        return this.#path.every((value, index) => array[index] === value || array[index] === '*');
    }
}