import {Space} from '../util/space.js';

/**
 * A collection of entities with multiple worlds and fast spatial searching.
 */

export class EntitySpace {
    #spaces = new Map();

    /**
     * Adds an entity to a world and deletes previously added duplicates from all worlds. Doing so automatically updates
     * the entity's location (world, x, and y).
     * @param {Entity} entity
     * @param {string} world
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
     * Deletes an entity from all worlds.
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

    /**
     * Returns each entity.
     * @return {Entity[]}
     */

    toArray() {
        return [...this.#spaces.values()].flatMap(space => space.toArray());
    }
}