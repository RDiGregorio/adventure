import {World} from 'shared/src/game/world.js';
import {Entity} from 'shared/src/game/entity.js';

const world = new World('default'), entity = new Entity();
entity.move('default', 100, 100);