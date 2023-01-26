import {GameObject} from './game-object.js';

export class Entity extends GameObject {
    /**
     * @return {string}
     */

    get type() {
        return undefined;
    }

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
        return this.has('location') ? this.get('location')[0] : 0;
    }

    /**
     * @return {number}
     */

    get y() {
        return this.has('location') ? this.get('location')[1] : 0;
    }

    /**
     * @param {string} world
     * @param {number} x
     * @param {number} y
     */

    move(world, x, y) {
        this.set('world', world);
        if (x !== this.x || y !== this.y) this.set('location', [x, y]);

        //const oldKey = Chunk.getKey(this.world, this.x, this.y), newKey = Chunk.getKey(world, x, y);
        //this.set('world', world);
        //if (x !== this.x || y !== this.y) this.set('location', [x, y]);
        //if (oldKey !== newKey) this.dispatchEvent(new GameEvent('chunk', [], newKey));
    }
}