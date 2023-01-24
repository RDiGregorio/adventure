import * as _ from 'lodash';

export function isJsonPrimitive(value) {
    return _.isNull(value) || _.isBoolean(value) || _.isFinite(value) || _.isString(value);
}

export function isJsonPrimitiveArray(value) {
    return Array.isArray(value) && value.every(isJsonPrimitive);
}