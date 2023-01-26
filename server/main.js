import {global} from 'shared/src/util/global.js';
import {ServerStorage} from './src/server-storage.js';

global.storage = new ServerStorage();
console.log(global.storage);