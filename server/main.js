import {Storage, mockExists, mockLoad, mockSave} from 'shared/src/util/storage.js';
import {jsonReplacer, jsonReviver} from 'shared/src/util/json.js';
import {EntityManager} from "shared/src/game/entity-manager.js";
import {Entity} from 'shared/src/game/entity.js';

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