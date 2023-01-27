import {Storage} from 'shared/src/util/storage.js';

export class Database extends Storage {
    constructor() {
        // todo: use an actual database

        const database = new Map();

        super(
            (key) => database.has(key),
            (key) => database.get(key),
            (key, value) => void database.set(key, value)
        );
    }
}