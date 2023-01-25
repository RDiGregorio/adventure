import {GameObject} from './lib/util/game-object.js';
import {jsonReplacer, jsonReviver, registerJsonReplacer, registerJsonReviver} from './lib/util/json.js';
import {registerClass} from './lib/util/instance.js';

registerClass(GameObject);
registerJsonReplacer(GameObject.jsonReplacer);
registerJsonReviver(GameObject.jsonReviver);
let object = new GameObject();
object.set('a', 0);
let json = JSON.stringify(object, jsonReplacer);
console.log(json);
object = JSON.parse(json, jsonReviver);
console.log(JSON.stringify(object, jsonReplacer));