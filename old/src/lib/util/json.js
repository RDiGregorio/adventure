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

export function jsonReplacer(key, value) {
    return replacers.reduce((result, callback) => callback(key, result), value);
}

/**
 * A reviver for `JSON.parse`.
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function jsonReviver(key, value) {
    return revivers.reduce((result, callback) => callback(key, result), value);
}