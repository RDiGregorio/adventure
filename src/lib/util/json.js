import _ from 'lodash';

/**
 * @param {*} value
 * @return {boolean}
 */

export function isJsonPrimitive(value) {
    return _.isNull(value) || _.isBoolean(value) || _.isFinite(value) || _.isString(value);
}

/**
 * @param {*} value
 * @return {boolean}
 */

export function isJsonPrimitiveArray(value) {
    return Array.isArray(value) && value.every(isJsonPrimitive);
}

/**
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function jsonReplacer(key, value) {
    return null;
}

/**
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function jsonReviver(key, value) {
    return null;
}