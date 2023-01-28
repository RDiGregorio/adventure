import {GameObject} from './game-object.js';
import {World} from './world.js';

export class Entity extends GameObject {
    /**
     * @return {string}
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

    /**
     * @param {string} world
     * @param {number} x
     * @param {number} y
     */
    /*
        move(world, x, y) {
            if (worldKey !== this.worldKey) {
                this.delete('location');
                World.get(this.worldKey).delete(this);
                this.set('worldKey', worldKey);
            }

            if (x !== this.x || y !== this.y) this.set('location', [x, y]);
            World.get(worldKey).add(this);
        }*/
}