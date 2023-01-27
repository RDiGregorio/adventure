import {World} from 'shared/src/game/world.js';
import {Entity} from 'shared/src/game/entity.js';

const world = World.get('default'), entity = new Entity();
entity.move('default', 100, 100);
entity.move('default', 100, 200);
console.log(JSON.stringify([...world.points]));