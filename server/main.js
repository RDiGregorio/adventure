import {Storage, mockExists, mockLoad, mockSave} from 'shared/src/util/storage.js';
import {jsonReplacer, jsonReviver} from 'shared/src/util/json.js';
import {ChunkManager} from 'shared/src/engine/chunk-manager.js';
import {Entity} from 'shared/src/engine/entity.js';
import {random} from 'shared/src/util/math.js';

// chunk manager is specific enough to the game to use entities

const manager = new ChunkManager(100, new Storage(mockExists, mockLoad, mockSave, jsonReviver, jsonReplacer));

await manager.load(0, 0, 0, () => {
    const result = [];

    for (let i = 0; i < 10; i++)
        result.push(new Entity(0, random(100), random(100)));

    return result;
});

console.log(manager.loadedChunkLocations);
await manager.save(0, 0, 0, true);
console.log(manager.loadedChunkLocations);
await manager.save(0, 0, 0, true);

const a = new Map(), b = new Map();
a.set('x', 0);
a.set('y', 0);
b.set('x', 0);
a.set('a', 0);

function replaceWith(left, right) {
    for (const key of left.keys())
        if (!right.has(key)) left.delete(key);

    for (const [key, value] of right)
        left.set(key, value);
}