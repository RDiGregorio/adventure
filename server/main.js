import {Database} from './src/database.js';
import {World} from 'shared/src/game/world.js';

const storage = new Database();
console.log(await storage.exists('a'));
await storage.save('a', 0);
console.log(await storage.exists('a'));
console.log(await storage.load('a'));

const world = new World('default');