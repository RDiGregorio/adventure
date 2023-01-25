import _ from 'lodash';
import {MultiMap} from './multi-map.js';
import {GameEvent} from './game-event.js';
import {uuid} from './uuid.js';
import {isJsonPrimitive, isJsonPrimitiveArray} from './json.js';
import {newInstance} from "./instance.js";

export class GameObject extends Map {
    #eventListeners = new Map();
    #id = uuid();
    #parentKeys = new MultiMap();

    /**
     * @return {string}
     */

    get id() {
        return this.#id;
    }

    /**
     * @param {string} string
     */

    set id(string) {
        this.#id = string;
    }

    /**
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
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static jsonReviver(key, value) {
        if (value?.hasOwnProperty('class') && value?.hasOwnProperty('id') && value?.hasOwnProperty('data')) {
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
        this.#eventListeners.forEach(callback => callback(event));

        for (const [parent, key] of this.#parentKeys)
            parent.dispatchEvent(new GameEvent(event.type, [key, ...event.path], event.value));
    }

    /**
     * @param {string[]} keys
     */

    getPath(keys) {
        return keys.reduce((result, key) => result.get(key), this);
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
}