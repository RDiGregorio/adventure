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

export function registerJsonReplacer(type, callback) {

}

export function registerJsonReviver(type, callback) {

}

/**
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function jsonReplace(key, value) {
    // TODO: need to be able to register replacers for various classes

    return null;
}

/**
 * @param {string} key
 * @param {*} value
 * @return {*}
 */

export function jsonRevive(key, value) {
    return null;
}