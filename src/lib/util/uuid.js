import {hex, random} from './math.js';

let count = 0;

/**
 * Returns a universally unique identifier.
 * @return {string}
 */

export function uuid() {
    return [random(), Date.now(), count++].map(hex).join('-');
}