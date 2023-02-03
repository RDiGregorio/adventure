import {Space} from '../util/space.js';

/**
 * Adds entities to worlds with fast spatial searching.
 */

class EntityManager {
    #spaces = new Map();

    /**
     * Adds an entity to a world.
     * @param {Entity} entity
     * @param {number} world
     * @param {number} x
     * @param {number} y
     */

    add(entity, world, x, y) {
        this.delete(entity);
        entity.set('world', world);
        entity.set('location', [x, y]);
        if (!this.#spaces.has(world)) this.#spaces.set(world, new Space(entity => entity.id));
        this.#spaces.get(world).add(entity, x, y);
    }

    /**
     * Deletes an entity from a world.
     * @param {Entity} entity
     */

    delete(entity) {
        this.#spaces.get(entity.get('world'))?.delete(entity);
    }

    /**
     * Searches a world for entities.
     * @param {number} world
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {Entity[]}
     */

    search(world, x, y, width, height) {
        return this.#spaces.get(world)?.search(x, y, width, height) ?? [];
    }
}