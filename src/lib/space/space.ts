import {Entity} from '../entity/entity';
import {SpatialEntity} from './spatial-entity';

export class Space extends Entity {
  update(entity: SpatialEntity) {
    const oldKey = this.get(entity.id), newKey = JSON.stringify(this.#sector(entity));

    if (this.id !== entity.spaceId || oldKey !== newKey) {
      this.get(oldKey)?.delete(entity.id);
      if (this.get(oldKey)?.size === 0) this.delete(oldKey);
    }

    if (this.id !== entity.spaceId) return;

    this.set(entity.id, newKey);
    if (!this.has(newKey)) this.set(newKey, new Entity());
    this.get(newKey).set(entity.id, entity);
  }

  #sector(entity: SpatialEntity) {
    const x = entity?.location?.x ?? 0, y = entity?.location?.x ?? 0;
    return [Math.floor(x / 100), Math.floor(y / 100)];
  }

  search(entity: SpatialEntity) {
    const [x, y] = this.#sector(entity);
    const result: Array<SpatialEntity> = [];

    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++) {
        const key = this.get(JSON.stringify([x + i, y + j]));
        if (this.has(key)) [...this.get(key).values()].forEach(entity => result.push(entity));
      }

    return result;
  }
}
