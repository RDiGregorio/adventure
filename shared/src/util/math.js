/**
 * Returns `number` as a hexadecimal string.
 * @param {number} number
 * @return {string}
 */

export function hex(number) {
    return number.toString(16);
}

/**
 * Returns a random integer between 0 (inclusive) and `number` (exclusive).
 * @param {number} [number = 4294967296]
 * @return {number}
 */

export function random(number = 2 ** 32) {
    return Math.floor(Math.random() * number);
}