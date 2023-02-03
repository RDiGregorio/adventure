/**
 * An event for an `ObservableMap`.
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
     * Returns the path to the event source.
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
}