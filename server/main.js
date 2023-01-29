import _ from 'lodash';
import {Storage, mockExists, mockLoad, mockSave} from 'shared/src/util/storage.js';
import {jsonReplacer, jsonReviver, registerJsonReplacer} from 'shared/src/util/json.js';
import {ChunkManager} from 'shared/src/engine/chunk-manager.js';
import {Entity} from 'shared/src/engine/entity.js';
import {random} from 'shared/src/util/math.js';
import {GameView} from 'shared/src/engine/game-view.js';
import {GameObject} from 'shared/src/engine/game-object.js';

const chunkManager = new ChunkManager(
    100,
    new Storage(mockExists, mockLoad, mockSave, jsonReviver, jsonReplacer),
    () => _.range(5).map(() => new Entity(0, random(100), random(100)))
);

const entity = new Entity(0, 0, 0);
const gameView = new GameView(entity, chunkManager);
await chunkManager.load(0, 0, 0);
await gameView.load();
registerJsonReplacer(GameObject.jsonReplacer);
console.log(JSON.stringify(gameView, jsonReplacer));