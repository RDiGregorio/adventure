import {Storage, mockExists, mockLoad, mockSave} from 'shared/src/util/storage.js';
import {jsonReplacer, jsonReviver} from 'shared/src/util/json.js';
import {ChunkManager} from "shared/src/game/entity-manager.js";
import {Entity} from 'shared/src/game/entity.js';
import {Space} from "shared/src/util/space.js";
/*
const manager = new EntityManager(new Storage(mockExists, mockLoad, mockSave, jsonReviver, jsonReplacer));
const entity = new Entity();
manager.add(entity, 0, 100, 200);
manager.add(new Entity(), 0, -1000, 500);
console.log(manager.toMap());
manager.delete(entity);
console.log(manager.toMap());
console.log(await manager.exists(0, 0, 0, 0, 0));
await manager.save(0, 0, 0, 0, 0);
console.log(await manager.exists(0, 0, 0, 0, 0));
 */

const space = new Space();
space.add('a', 0, 0);
space.add('b', 100, 100);
space.add('c', 1000, 1000);
space.add('d', 1000, 1000);

console.log(space.search(0, 0, 0, 0));