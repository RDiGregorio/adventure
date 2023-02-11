import {ObservableMap} from '../event/observable-map.js';
import {MapUtil} from '../util/map-util.js';
import {MultiMap} from '../util/multi-map.js';

/**
 * A view of a game. Each player in a game should have a different view of the game.
 */

export class View {
    #entities = new ObservableMap();
    #tiles = new MultiMap();
    #entitySpaces;

    /**
     * @param {...EntitySpace[]} entitySpaces
     */

    constructor(...entitySpaces) {
        this.#entitySpaces = entitySpaces;
    }

    /**
     * Adds an event listener. Returns a string for `removeEventListener`.
     * @param {function(MapEvent): void} callback
     * @return {string}
     */

    addEventListener(callback) {
        return this.#entities.addEventListener(callback);
    }

    /**
     * Removes an event listener using a string from `addEventListener`.
     * @param {string} key
     */

    removeEventListener(key) {
        return this.#entities.removeEventListener(key);
    }

    /**
     * Returns each entity.
     * @return {Entity[]}
     */

    toArray() {
        return [...this.#entities.values()];
    }

    /**
     * Searches a world for entities and dispatches events for each change.
     * @param {string} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */

    update(world, x, y, width, height) {
        const entities = this.#entitySpaces.flatMap(entitySpace => entitySpace.search(world, x, y, width, height));
        MapUtil.sync(this.#entities, new Map(entities.map(entity => [entity.id, entity])));
        MapUtil.sync(this.#tiles, new Map(entities.map(entity => [JSON.stringify([entity.x, entity.y]), entity])));
    }
}