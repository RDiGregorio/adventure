import _ from 'lodash';
import RTree from 'rtree';

export class Space {
    #rTree = new RTree();
    #map = new Map();
    #toKey;

    /**
     * @param {function(*): *} toKey
     */

    constructor(toKey = value => value) {
        this.#toKey = toKey;
    }

    /**
     * @return {Iterable<*>}
     */

    * [Symbol.iterator]() {
        const x = this.#rTree.root.x, y = this.#rTree.root.y;
        for (const value of this.#rTree.bbox(x, y, x + this.#rTree.root.w, y + this.#rTree.root.h))
            yield value;
    }

    /**
     * @param {*} value
     * @param {number} x
     * @param {number} y
     */

    add(value, x, y) {
        this.delete(value);
        if (!_.isFinite(x) || !_.isFinite(y)) return;
        this.#map.set(this.#toKey(value), [x, y]);
        this.#rTree.insert({x: x, y: y, w: 0, h: 0}, value);
    }

    /**
     * @param {*} value
     */

    delete(value) {
        const key = this.#toKey(value);
        if (!this.#map.has(key)) return;
        const [x, y] = this.#map.get(key);
        this.#map.delete(key);

        this
            .search(x, y, 1, 1)
            .filter(value => this.#toKey(value) === key)
            .forEach(value => this.#rTree.remove({x: x, y: y, w: 0, h: 0}, value));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {*[]}
     */

    search(x, y, width, height) {
        if (width < 1 || height < 1) return [];
        return this.#rTree.bbox(x, y, x + width - 1, y + height - 1);
    }
}