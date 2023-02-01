import {GameObject} from './game-object.js';

export class Player extends GameObject {
    #entity;

    constructor(entity) {
        super();
        this.#entity = entity;
    }

    get entity() {
        return this.#entity;
    }
}