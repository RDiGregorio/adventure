import {GameObject} from './game-object.js';
import {newInstance} from "../util/instance.js";

export class Entity extends GameObject {
    /**
     * @param {number} world
     * @param {number} x
     * @param {number} y
     */

    constructor(world, x, y) {
        super();
        this.set('world', world);
        this.set('location', [x, y]);
    }

    /**
     * @return {number}
     */

    get world() {
        return this.has('world') ? this.get('world') : 0;
    }

    /**
     * @return {number}
     */

    get x() {
        return this.has('location') ? this.get('location')[0] : 0;
    }

    /**
     * @return {number}
     */

    get y() {
        return this.has('location') ? this.get('location')[1] : 0;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static jsonReplacer(key, value) {
        if (value instanceof Entity) {
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
        if (value?.class === 'Entity') {
            const result = newInstance(value.class);
            result.id = value.id;
            Object.entries(value.data).forEach(entry => result.set(...entry));
            return result;
        }

        return value;
    }
}