import * as _ from 'lodash';

export function assert(value) {
  if (value !== true) throw new Error();
}

export function isJsonPrimitive(value) {
  return _.isNull(value) || _.isBoolean(value) || _.isFinite(value) || _.isString(value);
}
