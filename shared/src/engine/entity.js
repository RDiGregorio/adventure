import {uuid} from '../util/uuid.js';
import {ObservableMap} from '../event/observable-map.js';

/**
 * An `ObservableMap` with an id, type, and location.
 */

export class Entity extends ObservableMap {
    /**
     * @param {string} type
     */

    constructor(type) {
        super();
        this.set('id', uuid());
        this.set('type', type);
        this.set('world', '');
        this.set('location', [0, 0]);
    }

    /**
     * Returns an id.
     * @return {string}
     */

    get id() {
        return this.get('id');
    }

    /**
     * Returns a type.
     * @return {string}
     */

    get type() {
        return this.get('type');
    }

    /**
     * Returns a world name.
     * @return {string}
     */

    get world() {
        return this.get('world');
    }

    /**
     * Returns an x coordinate.
     * @return {number}
     */

    get x() {
        return this.get('location')[0];
    }

    /**
     * Returns a y coordinate.
     * @return {number}
     */

    get y() {
        return this.get('location')[1];
    }
}