import {ObservableMap} from '../event/observable-map.js';
import {MapUtil} from '../util/map-util.js';
import {Model} from './model.js';

/**
 * A view of a game. Each player in a game should have a different view of the game.
 */

export class View {
    #entities = new ObservableMap();
    #entitySpaces;

    /**
     * @param {Model} model
     */

    constructor(model) {
        this.#entitySpaces = [model.playerSpace, model.chunkSpace, model.petSpace];
    }

    /**
     * Returns the entities found from the last search.
     * @return {ObservableMap}
     */

    get entities() {
        return this.#entities;
    }

    /**
     * Searches a world for entities and stores the results as a map from ids to entities.
     * @param {string} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */

    search(world, x, y, width, height) {
        const entities = this.#entitySpaces.flatMap(entitySpace => entitySpace.search(world, x, y, width, height));
        MapUtil.sync(this.#entities, new Map(entities.map(entity => [entity.id, entity])));
    }
}