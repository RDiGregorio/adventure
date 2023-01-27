import {GameObject} from './game-object.js';
import {World} from './world.js';

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
        if (worldKey !== this.worldKey) {
            this.delete('location');
            World.get(this.worldKey).update(this);
            this.set('worldKey', worldKey);
        }

        if (x !== this.x || y !== this.y) this.set('location', [x, y]);
        World.get(this.worldKey).update(this);
    }
}