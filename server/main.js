import {Storage, mockExists, mockLoad, mockSave} from 'shared/src/util/storage.js';
import {jsonReplacer, jsonReviver} from 'shared/src/util/json.js';
import {ChunkManager} from 'shared/src/game/chunk-manager.js';
import {Entity} from 'shared/src/game/entity.js';
import {random} from 'shared/src/util/math.js';

const manager = new ChunkManager(new Storage(mockExists, mockLoad, mockSave, jsonReviver, jsonReplacer), 100);

await manager.load(0, 0, 0, (world, x, y) => {
    const result = [];

    for (let i = 0; i < 10; i++)
        result.push(new Entity(0, x + random(100), y + random(100)));

    return result;
});

console.log(manager.search(0, 0, 0, 100, 100));