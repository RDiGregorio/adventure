import {expect, test} from 'vitest';
import {ChunkManager} from '../src/entity/chunk-manager.js';
import {Entity} from '../src/entity/entity.js';
import {StorageAdapter} from '../src/transport/storage-adapter.js';
import {EntitySpace} from '../src/entity/entity-space.js';

const chunkSize = 100, saveMilliseconds = 1000;

function create(world, x, y) {
    // for(let i = 0; i < 10; i++)
}

test('chunkManager.foo', () => {
    const chunkManager = new ChunkManager(new EntitySpace(), new StorageAdapter(), chunkSize, saveMilliseconds, create);
});