import {GameObject} from './game-object.js';

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
        return this.get('world');
    }

    /**
     * @return {number}
     */

    get x() {
        return this.has('location') ? this.get('location')[0] : undefined;
    }

    /**
     * @return {number}
     */

    get y() {
        return this.has('location') ? this.get('location')[1] : undefined;
    }
}