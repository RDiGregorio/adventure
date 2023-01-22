import {Component} from '@angular/core';
import {SpatialEntity} from '../lib/space/spatial-entity';
import {Location} from '../lib/space/location';
import {Space} from 'src/lib/space/space';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  output = '';

  constructor() {
    const entities = [new SpatialEntity(), new SpatialEntity(), new SpatialEntity()];
    const space = new Space();
    entities[0].location = new Location(0, 0);
    entities[0].spaceId = space.id;
    entities[1].location = new Location(99, 99);
    entities[1].spaceId = space.id;
    entities[2].location = new Location(0, 200);
    entities[2].spaceId = space.id;
    space.update(entities[0]);
    space.update(entities[1]);
    space.update(entities[2]);
    console.log(space);
    this.output = `${space.search(entities[0]).length}`;
  }
}
