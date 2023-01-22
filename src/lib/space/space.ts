import {Entity} from '../entity/entity';

class Space extends Entity {
  static #sectorLength = 100;

  constructor() {
    super();
  }

  add(entity) {
    this.#sector(entity.get('location').x, entity.get('location').y).set(entity.id, entity);
  }

  remove(entity) {
    this.#sector(entity.get('location').x, entity.get('location').y).delete(entity.id);
  }

  #sector(x, y) {
    const key = JSON.stringify([Math.floor(x / Space.#sectorLength), Math.floor(y / Space.#sectorLength)]);
    if (!this.has(key)) this.set(key, new Entity());
    return this.get(key);
  }
}
