import {global} from 'shared/src/util/global.js';
import {World} from 'shared/src/game/world.js';
import {ServerStorage} from './src/server-storage.js';

global.storage = new ServerStorage();
const world = new World();
await world.load(0, 0, async (key, value) => []);