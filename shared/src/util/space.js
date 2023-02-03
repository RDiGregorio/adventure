import RTree from 'rtree';

/**
 * A collection of spatial objects.
 */

export class Space {
    #rTree = new RTree();
    #map = new Map();
    #identity;

    /**
     * @param {function(*): *} identity
     */

    constructor(identity = value => value) {
        this.#identity = identity;
    }

    /**
     * Returns each value.
     * @return {*[]}
     */

    toArray() {
        const x = this.#rTree.root.x, y = this.#rTree.root.y;
        return this.#rTree.bbox(x, y, x + this.#rTree.root.w, y + this.#rTree.root.h);
    }

    /**
     * Adds a value.
     * @param {*} value
     * @param {number} x
     * @param {number} y
     */

    add(value, x, y) {
        this.delete(value);
        this.#map.set(this.#identity(value), [x, y]);
        this.#rTree.insert({x: x, y: y, w: 0, h: 0}, value);
    }

    /**
     * Deletes a value.
     * @param {*} value
     */

    delete(value) {
        const key = this.#identity(value);
        if (!this.#map.has(key)) return;
        const [x, y] = this.#map.get(key);
        this.#map.delete(key);

        this
            .search(x, y, 1, 1)
            .filter(value => this.#identity(value) === key)
            .forEach(value => this.#rTree.remove({x: x, y: y, w: 0, h: 0}, value));
    }

    /**
     * Returns each value in a rectangle.
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