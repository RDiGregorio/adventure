import {jsonReplacer, jsonReviver} from './json';

export class Storage {
    static save(key, value) {
        // return window.localStorage.setItem(key, JSON.stringify(value, jsonReplacer));
    }

    static load(key) {
        // return JSON.parse(window.localStorage.getItem(key), jsonReviver);
    }
}