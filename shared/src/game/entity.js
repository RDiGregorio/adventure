import {GameObject} from './game-object.js';
import {World} from "./world.js";

export class Entity extends GameObject {
    /**
     * @param {string} type
     */

    constructor(type) {
        super();
        this.set('type', type);
    }

    /**
     * @return {string}
     */

    get type() {
        return this.get('type');
    }

    /**
     * @return {string}
     */

    get worldName() {
        return this.get('worldName');
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
     * @param {string} worldName
     * @param {number} x
     * @param {number} y
     */

    move(worldName, x, y) {
        this.set('worldName', worldName);
        if (x !== this.x || y !== this.y) this.set('location', [x, y]);
        // todo: update the world with the movements
        // todo: may need to think about the worlds more
    }
}