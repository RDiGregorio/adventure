export const wildcard = /.*/;

/**
 * Returns true if an array of strings matches an array of patterns.
 * @param {string[]} strings
 * @param {(string|RegExp)[]} patterns
 * @return {boolean}
 */

export function arrayMatches(strings, patterns) {
    return strings.length === patterns.length && strings.every((string, index) => string.match(patterns[index]));
}