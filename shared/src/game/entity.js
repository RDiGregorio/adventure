import {GameObject} from './game-object.js';

export class Entity extends GameObject {
    /**
     * @return {string}
     */

    get worldKey() {
        return this.get('worldKey');
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
     * @param {string} worldKey
     * @param {number} x
     * @param {number} y
     */

    move(worldKey, x, y) {
        if (worldKey !== this.worldName) {
            this.delete('location');
            this.set('worldKey', worldKey);
        }

        if (x !== this.x || y !== this.y) this.set('location', [x, y]);
    }
}