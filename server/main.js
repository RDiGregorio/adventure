import {Storage, mockExists, mockLoad, mockSave} from 'shared/src/util/storage.js';
import {jsonReplacer, jsonReviver} from 'shared/src/util/json.js';
import {ChunkManager} from 'shared/src/engine/chunk-manager.js';
import {Entity} from 'shared/src/engine/entity.js';
import {random} from 'shared/src/util/math.js';
import {GameView} from 'shared/src/engine/game-view.js';
import {GameObject} from "shared/src/engine/game-object.js";

const manager = new ChunkManager(
    100,
    new Storage(mockExists, mockLoad, mockSave, jsonReviver, jsonReplacer),
    () => {
        const result = [];

        for (let i = 0; i < 10; i++)
            result.push(new Entity(0, random(100), random(100)));

        return result;
    }
);

//const view = new GameView(new Entity());

await manager.load(0, 0, 0);

console.log(manager.loadedChunkLocations);
await manager.save(0, 0, 0, true);
console.log(manager.loadedChunkLocations);
await manager.save(0, 0, 0, true);

console.log(Entity.prototype instanceof GameObject);