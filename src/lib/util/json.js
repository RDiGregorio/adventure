import _ from 'lodash';
import {newInstance} from './instance.js';
import {GameObject} from './game-object.js';

const replacers = [], revivers = [];

/**
 * Returns true if `value` is a JSON primitive.
 * @param {*} value
 * @return {boolean}
 */

export function isJsonPrimitive(value) {
    return _.isNull(value) || _.isBoolean(value) || _.isFinite(value) || _.isString(value);
}

/**
 * Returns true if `value` is an array of JSON primitives.
 * @param {*} value
 * @return {boolean}
 */

export function isJsonPrimitiveArray(value) {
    return Array.isArray(value) && value.every(isJsonPrimitive);
}

/**
 * Registers `callback` for `jsonReplace`.
 * @param {function(string, *): *} callback
 */

export function registerJsonReplacer(callback) {
    replacers.push(callback);
}

/**
 * Registers `callback` for `jsonRevive`.
 * @param {function(string, *): *} callback
 */

export function registerJsonReviver(callback) {
    revivers.push(callback);
}

/**
 * A replacer for `JSON.stringify`.
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function jsonReplace(key, value) {
    return replacers.reduce((result, callback) => callback(key, result), value);
}

/**
 * A reviver for `JSON.parse`.
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function jsonRevive(key, value) {
    return revivers.reduce((result, callback) => callback(key, result), value);
}

registerJsonReplacer((key, value) => {
    if (value instanceof GameObject) {
        const data = Object.fromEntries(value.entries());
        return {class: value.constructor.name, id: value.id, data: data};
    }

    return value;
});

registerJsonReviver((key, value) => {
    if (value?.hasOwnProperty('class')) {
        const result = newInstance(value.class);
        result.id = value.id;
        Object.entries(value.data).forEach(entry => result.set(...entry));
        return result;
    }

    return value;
});