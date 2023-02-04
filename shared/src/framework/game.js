import {Model} from './model.js';
import {EntitySpace} from '../entity/entity-space.js';
import {View} from './view.js';
import {Controller} from './controller.js';

export class Game {
    #controllers = new Map();
    #views = new Map();
    #model = new Model(new EntitySpace(), new EntitySpace(), new EntitySpace());

    constructor() {
        // TODO: add a game loop
    }

    get model() {
        return this.#model;
    }

    view(id) {
        if (!this.#views.has(id)) this.#views.set(id, new View(this.#model));
        return this.#views.get(id);
    }

    controller(id) {
        if (!this.#controllers.has(id)) this.#controllers.set(id, new Controller(null, null));
        return this.#controllers.get(id);
    }
}