import {Entity} from '../entity/entity';
import {uuid} from '../util/lang';
import {Location} from './location'

export class SpatialEntity extends Entity {
  constructor() {
    super();
    this.set('location', new Location());
    this.set('spaceId', uuid());
  }

  get location() {
    return this.get('location');
  }

  get spaceId() {
    return this.get('spaceId');
  }
}
