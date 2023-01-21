import {Component} from '@angular/core';
import {uuid} from '../lib/util/uuid';
import {Entity} from '../lib/entity/entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  greeting = '';

  constructor() {
    const entity = new Entity();
    console.log(Entity.fromString(`${entity}`));
    this.greeting = uuid();
  }
}
