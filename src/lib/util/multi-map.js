export class MultiMap extends Map {
    /**
     * @returns {number}
     */

    get size() {
        return [...super.values()].reduce((result, value) => result + value.size, 0);
    }

    /**
     * @returns {Iterable<[*, *]>}
     */

    * [Symbol.iterator]() {
        for (const key of super.keys())
            for (const value of super.get(key))
                yield [key, value];
    }

    /**
     * @param {*} key
     * @param {*} value
     * @returns {boolean}
     */

    delete(key, value) {
        if (!super.has(key)) return false;
        if (arguments.length < 2) return super.delete(key);
        const result = super.get(key).delete(value);
        if (super.get(key).size === 0) super.delete(key);
        return result;
    }

    /**
     * @returns {Iterable<[*, *]>}
     */

    * entries() {
        for (const key of super.keys())
            for (const value of super.get(key))
                yield [key, value];
    }

    /**
     * @param {function(*, *, MultiMap)} callback
     * @param {*} self
     */

    forEach(callback, self = this) {
        for (const key of super.keys())
            for (const value of super.get(key))
                callback.apply(self, [value, key, this]);
    }

    /**
     * @param {*} key
     * @returns {Iterable<*>}
     */

    * get(key) {
        if (super.has(key))
            for (const value of super.get(key))
                yield value;
    }

    /**
     * @param {*} key
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
        for (const key of super.keys())
            for (const value of super.get(key))
                yield value;
    }
}