import {GameObject} from './game-object.js';
import {World} from "./world.js";

export class Entity extends GameObject {
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
        return this.has('location') ? this.get('location')[0] : undefined;
    }

    /**
     * @return {number}
     */

    get y() {
        return this.has('location') ? this.get('location')[1] : undefined;
    }

    /**
     * @param {string} worldName
     * @param {number} x
     * @param {number} y
     */

    move(worldName, x, y) {
        if (worldName !== this.worldName) {
            this.delete('location');
            this.set('worldName', worldName);
        }

        if (x !== this.x || y !== this.y) this.set('location', [x, y]);
    }
}