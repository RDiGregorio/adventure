import {registeredClass} from '../util/reflect.js';

class MapUtil {
    /**
     * Copies each entries from `source` to `target`.
     * @param {Map} target
     * @param {Map} source
     */

    static assign(target, source) {
        [...source].forEach(entry => target.set(...entry));
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

/**
 * A map replacer for `JSON.stringify`.
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function replaceMap(key, value) {
    return value instanceof Map ? {class: value.constructor.name, entries: [...value]} : value;
}

/**
 * A map reviver for `JSON.parse` using map classes registered with `registerClass`.
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function reviveMap(key, value) {
    const type = registeredClass(value?.class);
    return type === Map || type?.prototype instanceof Map ? new type(value.entries) : value;
}