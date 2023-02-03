// TODO: simplify this

const classes = new Map();

/**
 * Returns a class registered with `registerClass`.
 * @param {string} string
 * @return {Class}
 */

export function getRegisteredClass(string) {
    return classes.get(string);
}

/**
 * Returns a new instance of a class registered with `registerClass`.
 * @param {string} string
 * @param {*[]} array
 * @return {*}
 */

export function newInstance(string, array = []) {
    if (!classes.has(string)) throw new Error(`unregistered class: ${string}`);
    return new (classes.get(string))(...array);
}

/**
 * Registers `type` for `getClass` and `newInstance`.
 * @param {Class} type
 */

export function registerClass(type) {
    classes.set(type.name, type);
}