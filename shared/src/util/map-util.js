/**
 * A map utility.
 */

export class MapUtil {
    static #classes = new Map().set('Map', Map);

    /**
     * Copies each entry from `source` to `target`.
     * @param {Map} target
     * @param {Map} source
     */

    static assign(target, source) {
        [...source].forEach(entry => target.set(...entry));
    }

    /**
     * Registers a class for `MapUtil.reviveMap`.
     * @param {Class} type
     */

    static registerClass(type) {
        MapUtil.#classes.set(type.name, type);
    }

    /**
     * A map replacer for `JSON.stringify`.
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static replaceMap(key, value) {
        return value instanceof Map ? {class: value.constructor.name, entries: [...value]} : value;
    }

    /**
     * A map reviver for `JSON.parse` using map classes registered with `MapUtil.registerClass`.
     * @param {string} key
     * @param {*} value
     * @return {*}
     */

    static reviveMap(key, value) {
        const type = MapUtil.#classes.get(value?.class);

        return type === Map || type?.prototype instanceof Map
            ? value.entries.reduce((result, entry) => result.set(...entry), new type())
            : value;
    }

    /**
     * Replaces the entries of `target` with the entries of `source`.
     * @param {Map} target
     * @param {Map} source
     */

    static sync(target, source) {
        [...target.keys()]
            .filter(key => !source.has(key) || source.get(key) !== target.get(key))
            .forEach(key => target.delete(key));

        MapUtil.assign(target, source);
    }
}