import {Entity} from '../entity/entity';

export class Location extends Entity {
  constructor(x, y) {
    super();
    this.set('x', x);
    this.set('y', y);
  }

  get x() {
    return this.get('x');
  }

  get y() {
    return this.get('y');
  }
}
