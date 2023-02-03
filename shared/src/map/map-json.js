import {registeredClass} from '../util/reflection.js';

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
 * A map reviver for `JSON.parse` using map classes registered with `registerClass`.
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function revive(key, value) {
    const type = registeredClass(value?.class);
    return type === Map || type?.prototype instanceof Map ? new type(value.entries) : value;
}