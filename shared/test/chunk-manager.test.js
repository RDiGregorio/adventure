import {expect, test} from 'vitest';
import {ChunkManager} from '../src/entity/chunk-manager.js';
import {Entity} from '../src/entity/entity.js';
import {StorageAdapter} from '../src/transport/storage-adapter.js';
import {EntitySpace} from '../src/entity/entity-space.js';

const chunkSize = 100;

function create(world, x, y) {
    const result = [];

    for (let i = 0; i < 10; i++)
        result.push(new Entity('', '', x + i * 10, y + i * 10));

    return result;
}

test('chunkManager.search', async () => {
    const
        entitySpace = new EntitySpace(),
        chunkManager = new ChunkManager(entitySpace, new StorageAdapter(), chunkSize);

    await chunkManager.loadNearbyChunks('', 0, 0, create);
    const entities = entitySpace.search('', -chunkSize, -chunkSize, chunkSize * 3, chunkSize * 3);
    expect(entities.length).toBe(90);
});