import * as _ from 'lodash';

let count = 0;

/**
 * Returns a universally unique identifier.
 * @returns {string}
 */

export function uuid() {
  return [_.random(0, Number.MAX_SAFE_INTEGER), Date.now(), count++].map(number => number.toString(16)).join('-');
}
