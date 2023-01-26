import {global} from 'shared/src/util/global.js';
import {Storage} from 'shared/src/util/storage.js';

global.storage = new Storage();
console.log(global.storage);