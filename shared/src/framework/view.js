import {ObservableMap} from '../event/observable-map.js';
import {MapUtil} from "../util/map-util.js";

/**
 * A view of multiple entity spaces.
 */

export class View {
    #entities = new ObservableMap();
    #entitySpaces;

    /**
     * @param {...EntitySpace[]} entitySpaces
     */

    constructor(...entitySpaces) {
        this.#entitySpaces = entitySpaces;
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