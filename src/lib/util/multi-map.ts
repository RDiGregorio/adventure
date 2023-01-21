export function multiMapAdd(map, key, value) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

export function multiMapDelete(map, key, value) {
  map.get(key)?.delete(value);
  if (map.get(key)?.size === 0) map.delete(key);
}
