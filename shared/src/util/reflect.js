const classes = new Map();

/**
 * Returns a class registered with `registerClass`.
 * @param {string} name
 * @return {Class}
 */

export function registeredClass(name) {
    return classes.get(name);
}

/**
 * Registers a class for `registeredClass`.
 * @param {Class} type
 */

export function registerClass(type) {
    classes.set(type.name, type);
}