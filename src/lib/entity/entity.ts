import * as _ from 'lodash';
import {assert, isJsonPrimitive, uuid} from '../util/util';
import {EntityEvent} from './entity-event';

export class Entity extends Map {
  static #types = new Map().set('Entity', Entity);
  #eventListeners = new Map();
  #containers = new Map();

  constructor() {
    super();
    super.set('id', uuid());
    super.set('type', this.constructor.name);
  }

  get id() {
    return this.get('id');
  }

  get type() {
    return this.get('type');
  }

  static fromString(string) {
    return JSON.parse(string, (key, value) => {
      if (!_.isObject(value)) return value;
      const result = new (this.#types.get(value['type']));
      Object.entries(value).forEach(entry => result.set(...entry));
      return result;
    });
  }

  static registerType(type) {
    assert(type.prototype instanceof Entity);
    this.#types.set(type.name, type);
  }

  addEventListener(callback) {
    const key = uuid();
    this.#eventListeners.set(key, callback);
    return key;
  }

  clear() {
    [...this.keys()].forEach(this.delete);
  }

  dispatchEvent(event) {
    [...this.#containers.entries()].forEach(entry => entry[1].forEach(key =>
      entry[0].dispatchEvent(new EntityEvent(event.type, [key, ...event.path], event.value))
    ));

    [...this.#eventListeners.values()].forEach(eventListener => eventListener(event));
  }

  removeEventListener(key) {
    this.#eventListeners.delete(key);
  }

  set(key, value) {
    assert(_.isUndefined(value) || isJsonPrimitive(value) || value instanceof Entity);

    if (this.get(key) !== value) {
      _.isUndefined(value) ? super.delete(key) : super.set(key, value);

      if (value instanceof Entity) {
        if (!value.#containers.has(this)) value.#containers.set(this, new Set());
        value.#containers.get(this).add(key);
      }

      this.dispatchEvent(new EntityEvent('set', [key], value));
    }

    return this;
  }

  delete(key) {
    if (this.has(key)) {
      if (this.get(key) instanceof Entity) {
        this.get(key).#containers.get(this)?.delete(key);
        if (this.get(key).#containers.get(this)?.size === 0) this.get(key).#containers.delete(this);
      }

      this.set(key, undefined);
      return true;
    }

    return false;
  }

  toArray() {
    return [...this.entries()].filter(entry => !['id', 'type'].includes(entry[0])).map(entry => entry[1]);
  }

  toString() {
    return JSON.stringify(this, (key, value) => value instanceof Entity ? Object.fromEntries(value) : value);
  }
}
