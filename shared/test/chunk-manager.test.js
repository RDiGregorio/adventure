import {expect, test} from 'vitest';
import {ChunkManager} from '../src/entity/chunk-manager.js';
import {Entity} from '../src/entity/entity.js';
import {StorageAdapter} from '../src/transport/storage-adapter.js';
import {EntitySpace} from '../src/entity/entity-space.js';
import {random} from '../src/util/math.js';

const chunkSize = 100, saveMilliseconds = 1000;

function create(world, x, y) {
    const result = [];

    for (let i = 0; i < 10; i++)
        result.push(new Entity('', '', x + random(chunkSize), y + random(chunkSize)));

    return result;
}

test('chunkManager.foo', async () => {
    const
        chunkManager = new ChunkManager(new EntitySpace(), new StorageAdapter(), chunkSize, saveMilliseconds, create),
        entities = await chunkManager.search('', 0, 0);
//failed, 88?
    expect(entities.length).toBe(90);
});