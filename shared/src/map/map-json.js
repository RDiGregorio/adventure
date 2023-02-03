import {toClass} from '../util/reflection.js';

/**
 * A map replacer for `JSON.stringify`.
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function replace(key, value) {
    return value instanceof Map ? {class: value.constructor.name, entries: [...value]} : value;
}

/**
 * A map reviver for `JSON.parse`.
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function revive(key, value) {
    const type = toClass(value?.class);
    return type === Map || type?.prototype instanceof Map ? new type(value.entries) : value;
}