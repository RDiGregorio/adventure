import {MultiMap} from './multi-map.js';
import {isJsonPrimitive, uuid} from './util.js';
import {GameEvent} from './game-event.js';

export class GameObject extends Map {
    #eventListeners = new Map();
    #parentKeys = new MultiMap();

    /**
     * @param {function(GameEvent): void} callback
     * @return {string}
     */

    addEventListener(callback) {
        const key = uuid();
        this.#eventListeners.set(key, callback);
        return key;
    }

    clear() {
        this.keys().forEach(this.delete);
    }


    /**
     * @param {string} key
     * @return {boolean}
     */

    delete(key) {
        const result = this.has(key);
        this.set(key, undefined);
        return result;
    }

    /**
     * @param {GameEvent} event
     */

    dispatchEvent(event) {
        for (const [parent, key] of this.#parentKeys)
            parent.dispatchEvent(new GameEvent(event.type, [key, ...event.path], event.value));

        this.#eventListeners.forEach(callback => callback(event));
    }

    /**
     * @param {string} key
     */

    removeEventListener(key) {
        this.#eventListeners.delete(key);
    }

    /**
     * @param {string} key
     * @param {*} value
     */

    set(key, value) {
        if (this.get(key) === value) return this;
        if (this.get(key) instanceof GameObject) this.get(key).#parents.delete(this, key);
        value === undefined ? super.delete(key) : super.set(key, value);
        if (value instanceof GameObject) value.#parentKeys.set(this, key);
        this.dispatchEvent(new GameEvent('update', [key], value));
        return this;
    }
}