const classes = new Map();

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
 * Registers `type` for `newInstance`.
 * @param {Class} type
 */

export function registerClass(type) {
    classes.set(type.name, type);
}