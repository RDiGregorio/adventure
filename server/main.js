import {World} from 'shared/src/game/world.js';
import {Entity} from 'shared/src/game/entity.js';
import {Space} from "shared/src/util/space.js";

//const world = World.get('default'), entity = new Entity();
//entity.move('default', 100, 100);
//entity.move('default', 100, 200);
//console.log(JSON.stringify([...world.points]));

const space = new Space(value => `${value}`);
space.add('a', 0, 0);
space.add('a', 0, 0);