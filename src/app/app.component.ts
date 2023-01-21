import {Component} from '@angular/core';
import {uuid} from '../lib/uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  greeting = '';

  constructor() {
    this.greeting = uuid();
  }
}
