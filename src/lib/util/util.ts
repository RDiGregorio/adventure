import * as _ from 'lodash';

let count = 0;

export function assert(value) {
  if (value !== true) throw new Error();
}

export function isJsonPrimitive(value) {
  return _.isNull(value) || _.isBoolean(value) || _.isFinite(value) || _.isString(value);
}

export function uuid() {
  return [_.random(0, Number.MAX_SAFE_INTEGER), Date.now(), count++].map(number => number.toString(16)).join('-');
}
