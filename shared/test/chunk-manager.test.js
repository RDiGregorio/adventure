import {expect, test} from 'vitest';
import {ChunkManager} from '../src/entity/chunk-manager.js';
import {Entity} from '../src/entity/entity.js';
import {StorageAdapter} from '../src/transport/storage-adapter.js';
import {EntitySpace} from '../src/entity/entity-space.js';

const chunkSize = 100, saveMilliseconds = 1000;

function create(world, x, y) {
    const result = [];

    for (let i = 0; i < 1; i++)
        result.push(new Entity('', '', x + i * 10, y + i * 10));

    //console.log(result[0].get('location'));

    return result;
}

test('chunkManager.foo', async () => {
    const
        chunkManager = new ChunkManager(new EntitySpace(), new StorageAdapter(), chunkSize, saveMilliseconds, create),
        entities = await chunkManager.search('', 0, 0);

    entities.forEach(entity => console.log([entity.x, entity.y]));
//failed, 88?
    expect(entities.length).toBe(9);
});