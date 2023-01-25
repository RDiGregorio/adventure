import {GameObject} from './game-object.js';
import {GameEvent} from "./game-event.js";

class Chunk extends GameObject {
    static size = 100;

    constructor(world, x, y) {
        super();
        const key = Chunk.getKey(world, x, y);

        this.addEventListener(event => {
            // TODO: this doesn't really work. Instead there just needs to be a 'world' object

            if (event.type !== 'chunk') return;
            const entity = this.getPath(event.path);
            key === event.value ? this.set(entity.id, entity) : this.delete(entity.id);
        });
    }

    /**
     * @param {string} world
     * @param {number} x
     * @param {number} y
     * @return {string}
     */

    static getKey(world, x, y) {
        return JSON.stringify([world, Math.floor(x / Chunk.size), Math.floor(y / Chunk.size)]);
    }

}

class Entity extends GameObject {
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
        const oldKey = Chunk.getKey(this.world, this.x, this.y), newKey = Chunk.getKey(world, x, y);
        this.set('world', world);
        if (x !== this.x || y !== this.y) this.set('location', [x, y]);
        if (oldKey !== newKey) this.dispatchEvent(new GameEvent('chunk', [], newKey));
    }
}