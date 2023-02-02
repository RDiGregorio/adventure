import _ from 'lodash';
import {GameEvent} from './game-event.js';
import {MultiMap} from '../util/multi-map.js';
import {uuid} from '../util/uuid.js';
import {isJsonPrimitive, isJsonPrimitiveArray} from '../util/json.js';
import {getRegisteredClass, newInstance} from '../util/instance.js';

/**
 * A map with events and an id. Supports JSON encoding and decoding.
 */

export class GameObject extends Map {
    #eventListeners = new Map();
    #id = uuid();
    #parentKeys = new MultiMap();

    /**
     * Returns an id.
     * @return {string}
     */

    get id() {
        return this.#id;
    }

    /**
     * Assigns an id.
     * @param {string} string
     */

    set id(string) {
        this.#id = string;
    }

    /**
     * A replacer for encoding a `GameObject` with `JSON.stringify`.
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static jsonReplacer(key, value) {
        if (value instanceof GameObject) {
            const data = Object.fromEntries(value.entries());
            return {class: value.constructor.name, id: value.id, data: data};
        }

        return value;
    }

    /**
     * A reviver for decoding a `GameObject` with `JSON.parse`.
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static jsonReviver(key, value) {
        const type = getRegisteredClass(value?.class);

        if (type === GameObject || type?.prototype instanceof GameObject) {
            const result = newInstance(value.class);
            result.id = value.id;
            Object.entries(value.data).forEach(entry => result.set(...entry));
            return result;
        }

        return value;
    }

    static #isValidArgument(value) {
        if (value === undefined || isJsonPrimitive(value) || isJsonPrimitiveArray(value)) return true;
        return value instanceof GameObject;
    }

    /**
     * Adds `callback` as an event listener. Returns a string for `removeEventListener`.
     * @param {function(GameEvent): void} callback
     * @return {string}
     */

    addEventListener(callback) {
        const key = uuid();
        this.#eventListeners.set(key, callback);
        return key;
    }

    /**
     * Deletes each entry.
     */

    clear() {
        this.keys().forEach(this.delete);
    }

    /**
     * Deletes the entry for `key`.
     * @param {string} key
     * @return {boolean}
     */

    delete(key) {
        const result = this.has(key);
        this.set(key, undefined);
        return result;
    }

    /**
     * Dispatches `event` to each event listener.
     * @param {GameEvent} event
     */

    dispatchEvent(event) {
        this.#eventListeners.forEach(callback => callback(event));

        for (const [parent, key] of this.#parentKeys)
            parent.dispatchEvent(new GameEvent(event.type, [key, ...event.path], event.value));
    }

    /**
     * Returns a value. Returns a nested value if `key` is a string.
     * @param {string|string[]} key
     */

    get(key) {
        return Array.isArray(key) ? key.reduce((result, key) => result?.get(key), this) : super.get(key);
    }

    /**
     * Removes an event listener using a string from `addEventListener`.
     * @param {string} key
     */

    removeEventListener(key) {
        this.#eventListeners.delete(key);
    }

    /**
     * Creates an entry with a `GameObject`, JSON primitive, or array of JSON primitives as a value.
     * @param {string} key
     * @param {*} value
     */

    set(key, value) {
        if (!GameObject.#isValidArgument(value)) throw new Error(`invalid argument: ${value}`);

        if (isJsonPrimitiveArray(value)) {
            if (_.isEqual(this.get(key), value)) return this;
            value = [...value];
        }

        if (this.get(key) === value) return this;
        if (this.get(key) instanceof GameObject) this.get(key).#parentKeys.delete(this, key);
        value === undefined ? super.delete(key) : super.set(key, value);
        if (value instanceof GameObject) value.#parentKeys.set(this, key);
        this.dispatchEvent(new GameEvent('update', [key], value));
        return this;
    }

    /**
     * Replaces each entry with the entries of `other`.
     * @param {Map<string, *>} other
     */

    sync(other) {
        [...this.keys()].filter(key => !other.has(key)).forEach(key => this.delete(key));
        [...other].forEach(entry => this.set(...entry));
    }
}