const classes = new Map();

export function replace(key, value) {
    return value instanceof Map ? {class: value.constructor.name, entries: [...value]} : value;
}

export function revive(key, value) {
    const type = toClass(value?.class);
    return type === Map || type?.prototype instanceof Map ? new type(value.entries) : value;
}

/**
 * Returns a class registered with `registerClass`.
 * @param {string} name
 * @return {Class}
 */

export function toClass(name) {
    return classes.get(name);
}

/**
 * Registers a class for `toClass`.
 * @param {Class} type
 */

export function registerClass(type) {
    classes.set(type.name, type);
}