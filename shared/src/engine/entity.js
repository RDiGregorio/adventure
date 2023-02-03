import {uuid} from '../util/uuid.js';
import {EventfulMap} from '../map/eventful-map.js';

export class Entity extends EventfulMap {
    /**
     * @param {string} type
     */

    constructor(type) {
        super();
        this.set('id', uuid());
        this.set('type', type);
        this.set('world', 0);
        this.set('location', [0, 0]);
    }

    /**
     * @return {string}
     */

    get id() {
        return this.get('id');
    }

    /**
     * @return {string}
     */

    get type() {
        return this.get('type');
    }

    /**
     * @return {number}
     */

    get world() {
        return this.get('world');
    }

    /**
     * @return {number}
     */

    get x() {
        return this.get('location')[0];
    }

    /**
     * @return {number}
     */

    get y() {
        return this.get('location')[1];
    }
}