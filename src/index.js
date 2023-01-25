import {GameObject} from './lib/util/game-object.js';
import {jsonRevive, registerJsonReplacer, registerJsonReviver} from './lib/util/json.js';
import {registerClass} from './lib/util/instance.js';

registerClass(GameObject);
registerJsonReplacer(GameObject.jsonReplacer);
registerJsonReviver(GameObject.jsonReviver);
let object = new GameObject();
object.set('a', 0);
let json = `${object}`;
console.log(json);
object = JSON.parse(json, jsonRevive);
json = `${object}`;
console.log(json);