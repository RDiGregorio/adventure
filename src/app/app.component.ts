import {Component} from '@angular/core';
import {uuid} from '../lib/util/lang';
import {SpatialEntity} from '../lib/space/spatial-entity';
import {Location} from '../lib/space/location';
import { Space } from 'src/lib/space/space';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  output = '';

  constructor() {
    const entity = new SpatialEntity();
    const space = new Space();
    entity.location = new Location(0, 0);
    entity.spaceId = space.id;
    space.update(entity);
    this.output = `${space}`;
  }
}
