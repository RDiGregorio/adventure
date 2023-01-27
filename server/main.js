import {ServerStorage} from './src/server-storage.js';

const storage = new ServerStorage();
console.log(await storage.exists('a'));
await storage.save('a', 0);
console.log(await storage.exists('a'));
console.log(await storage.load('a'));