import {GameObject} from './game-object.js';

export class Entity extends GameObject {
    /**
     * @param {string} type
     * @param {number} world
     * @param {number} x
     * @param {number} y
     */

    constructor(type, world, x, y) {
        super();
        this.set('type', type);
        this.set('world', world);
        this.set('location', [x, y]);
    }

    get type() {
        return this.get('type');
    }

    /**
     * @return {number}
     */

    get world() {
        return this.get('world');
    }

    /**
     * @return {number}
     */

    get x() {
        return this.get('location')[0];
    }

    /**
     * @return {number}
     */

    get y() {
        return this.get('location')[1];
    }
}