import {GameObject} from "./lib/util/game-object.js";
import {jsonRevive} from "./lib/util/json.js";

GameObject.registerClass(GameObject);
let object = new GameObject();
object.set('a', 0);
let json = `${object}`;
console.log(json);
object = JSON.parse(json, jsonRevive);
json = `${object}`;
console.log(json);