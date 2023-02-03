import {MapEvent} from './map-event.js';
import {MultiMap} from '../util/multi-map.js';
import {uuid} from '../util/uuid.js';

/**
 * A map with events. Dispatches an "update" event when modified.
 */

export class ObservableMap extends Map {
    #eventListeners = new Map();
    #parentKeys = new MultiMap();

    /**
     * Adds an event listener. Returns a string for `removeEventListener`.
     * @param {function(MapEvent): void} callback
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
     * Deletes an entry.
     * @param {string} key
     * @return {boolean}
     */

    delete(key) {
        const result = this.has(key);
        this.set(key, undefined);
        return result;
    }

    /**
     * Dispatches an event to each event listener.
     * @param {MapEvent} event
     */

    dispatchEvent(event) {
        this.#eventListeners.forEach(callback => callback(event));

        for (const [parent, key] of this.#parentKeys)
            parent.dispatchEvent(new MapEvent(event.type, [key, ...event.path], event.value));
    }

    /**
     * Returns a value. Returns a nested value if `key` is an array.
     * @param {string|string[]} key
     * @return {*}
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
     * Assigns a value. Assigning an undefined value deletes an entry. Returns the `ObservableMap`.
     * @param {string} key
     * @param {*} value
     * @return {ObservableMap}
     */

    set(key, value) {
        if (this.get(key) === value) return this;
        if (this.get(key) instanceof ObservableMap) this.get(key).#parentKeys.delete(this, key);
        value === undefined ? super.delete(key) : super.set(key, value);
        if (value instanceof ObservableMap) value.#parentKeys.set(this, key);
        this.dispatchEvent(new MapEvent('update', [key], value));
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