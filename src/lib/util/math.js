/**
 * @param {number} number
 * @return {string}
 */

export function hex(number) {
    return number.toString(16);
}

/**
 * @param limit
 * @return {number}
 */

export function random(limit = 2 ** 32) {
    return Math.floor(Math.random() * limit);
}