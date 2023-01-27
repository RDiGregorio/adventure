import RTree from 'rtree';

export class Space {
    #rTree = new RTree();
    #map = new Map();

    /**
     * @return {Iterable<[number, number]>}
     */

    get points() {
        return this.#map.values();
    }

    /**
     * @param {*} value
     * @param {number} x
     * @param {number} y
     */

    add(value, x, y) {
        this.delete(value);
        if (Number.isNaN(x) || Number.isNaN(y)) return;
        this.#map.set(value, [x, y]);
        this.#rTree.insert({x: x, y: y, w: 0, h: 0}, value);
    }

    /**
     * @param {*} value
     */

    delete(value) {
        if (!this.#map.has(value)) return;
        const [x, y] = this.#map.get(value);
        this.#map.delete(value);
        this.#rTree.remove({x: x, y: y, w: 0, h: 0}, value);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {*[]}
     */

    search(x, y, width, height) {
        return this.#rTree.bbox([x, y], [x + width - 1, y + height - 1]);
    }
}