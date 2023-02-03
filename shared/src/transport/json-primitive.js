import _ from 'lodash';

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