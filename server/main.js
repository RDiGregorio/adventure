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

console.log(manager.chunks);
await manager.save(0, 0, 0, true);
console.log(manager.chunks);
await manager.save(0, 0, 0, true);