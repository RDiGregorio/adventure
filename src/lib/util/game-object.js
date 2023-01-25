import {MultiMap} from './multi-map.js';
import {GameEvent} from './game-event.js';
import {uuid} from './uuid.js';
import {isJsonPrimitive, isJsonPrimitiveArray} from './util.js';

export class GameObject extends Map {
    static #classes = new Map().set('GameObject', GameObject);
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
     * @return {GameObject}
     */

    static fromString(string) {
        return JSON.parse(string, (key, value) => {
            if (value?.hasOwnProperty('class')) {
                if (!GameObject.#classes.has(value.class)) throw new Error(`unregistered class: ${value.class}`);
                const result = new (GameObject.#classes.get(value.class));
                result.#id = value.id;
                Object.entries(value.data).forEach(entry => result.set(...entry));
                return result;
            }

            return value;
        });
    }

    /**
     * @param {Class} value
     */

    static registerClass(value) {
        GameObject.#classes.set(value.constructor.name, value);
    }

    static #validArgument(value) {
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
        if (!GameObject.#validArgument(value)) throw new Error(`invalid argument: ${value}`);

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
     * @return {string}
     */

    toString() {
        return JSON.stringify(this, (key, value) => {
            if (value instanceof GameObject) {
                const data = Object.fromEntries(this.entries());
                return {class: this.constructor.name, id: this.id, data: data};
            }

            return value;
        });
    }
}