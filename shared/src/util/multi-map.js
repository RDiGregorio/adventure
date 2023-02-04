/**
 * A map with multiple values per key.
 */

export class MultiMap extends Map {
    /**
     * Returns the number of entries.
     * @return {number}
     */

    get size() {
        return [...super.values()].reduce((result, value) => result + value.size, 0);
    }

    /**
     * Returns each entry.
     * @return {Iterable<[*, *]>}
     */

    * [Symbol.iterator]() {
        for (const key of super.keys())
            for (const value of super.get(key))
                yield [key, value];
    }

    /**
     * Deletes an entry. Returns true if the entry existed.
     * @param {*} key
     * @param {*} [value]
     * @return {boolean}
     */

    delete(key, value) {
        if (!super.has(key)) return false;
        if (arguments.length < 2) return super.delete(key);
        const result = super.get(key).delete(value);
        if (super.get(key).size === 0) super.delete(key);
        return result;
    }

    /**
     * Returns each entry.
     * @return {Iterable<[*, *]>}
     */

    * entries() {
        for (const key of super.keys())
            for (const value of super.get(key))
                yield [key, value];
    }

    /**
     * Calls `callback` with each entry.
     * @param {function(*, *, MultiMap)} callback
     * @param {*} [self = this]
     */

    forEach(callback, self = this) {
        for (const key of super.keys())
            for (const value of super.get(key))
                callback.apply(self, [value, key, this]);
    }

    /**
     * Returns a value.
     * @param {*} key
     * @return {Iterable<*>}
     */

    * get(key) {
        if (super.has(key))
            for (const value of super.get(key))
                yield value;
    }

    /**
     * Assigns a value.
     * @param {*} key
     * @param {*} value
     * @return {MultiMap}
     */

    set(key, value) {
        if (!super.has(key)) super.set(key, new Set());
        super.get(key).add(value);
        return this;
    }

    /**
     * Returns each value.
     * @return {Iterable<*>}
     */

    * values() {
        for (const key of super.keys())
            for (const value of super.get(key))
                yield value;
    }
}