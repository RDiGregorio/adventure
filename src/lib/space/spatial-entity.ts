import {Entity} from '../entity/entity';
import {Location} from './location'

export class SpatialEntity extends Entity {
  get location() {
    return this.get('location');
  }

  set location(location: Location) {
    this.set('location', location);
  }

  get spaceId() {
    return this.get('spaceId');
  }

  set spaceId(id: string) {
    this.set('spaceId', id);
  }
}
