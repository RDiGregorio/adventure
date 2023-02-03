export function replace(key, value) {
    return value instanceof Map ? {class: value.constructor.name, entries: [...value]} : value;
}

export function revive(key, value) {
    const type = toClass(value?.class);
    return type === Map || type?.prototype instanceof Map ? new type(value.entries) : value;
}

function toClass(name) {
    return null;
}