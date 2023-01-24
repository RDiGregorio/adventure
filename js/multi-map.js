class MultiMap extends Map {
    /**
     * @returns {number}
     */

    get size() {
        return [...super.values()].reduce((result, value) => result + value.size, 0);
    }

    /**
     * @returns {Iterable<[string, *]>}
     */

    * [Symbol.iterator]() {
        for (const key of super.keys()) for (const value of super.get(key)) yield [key, value];
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {boolean}
     */

    delete(key, value) {
        return super.has(key) && super.get(key).delete(value);
    }

    /**
     * @returns {Iterable<[string, *]>}
     */

    * entries() {
        for (const key of super.keys()) for (const value of super.get(key)) yield [key, value];
    }

    /**
     * @param {function(*, string, MultiMap)} callback
     */

    forEach(callback) {
        for (const key of super.keys()) for (const value of super.get(key)) callback(value, key, this);
    }

    /**
     * @param {string} key
     * @returns {Iterable<*>}
     */

    * get(key) {
        if (super.has(key)) for (const value of super.get(key)) yield value;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {MultiMap}
     */

    set(key, value) {
        if (!super.has(key)) super.set(key, new Set());
        super.get(key).add(value);
        return this;
    }

    /**
     * @returns {Iterable<*>}
     */

    * values() {
        for (const key of super.keys()) for (const value of super.get(key)) yield value;
    }
}