import {Entity} from '../entity/entity';
import {SpatialEntity} from './spatial-entity';

export class Space extends Entity {
  #sector(entity: SpatialEntity) {
    const x = entity?.location?.x ?? 0, y = entity?.location?.y ?? 0;
    return [Math.floor(x / 100), Math.floor(y / 100)];
  }

  update(entity: SpatialEntity) {
    const oldKey = this.get(entity.id), newKey = JSON.stringify(this.#sector(entity));

    if (this.id !== entity.spaceId || oldKey !== newKey) {
      this.get(oldKey)?.delete(entity.id);
      if (this.get(oldKey)?.size === 2) this.delete(oldKey);
    }

    if (this.id !== entity.spaceId) {
      this.delete(entity.id);
      return;
    }

    this.set(entity.id, newKey);

    // TODO: instead of a generic entity, i need something that can handle terrain
    // change classes to "World" and "WorldChunk"?

    if (!this.has(newKey)) this.set(newKey, new Entity());
    this.get(newKey).set(entity.id, entity);
  }

  // todo: really this should just be replaced with nearbyChunks
  // todo: can add a generic method to entity that updates based on another entity

  search(entity: SpatialEntity) {
    const [x, y] = this.#sector(entity), result: Array<SpatialEntity> = [];

    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++) {
        const key = JSON.stringify([x + i, y + j]);
        if (this.has(key)) result.push(...this.get(key).toArray());
      }

    return result;
  }
}
