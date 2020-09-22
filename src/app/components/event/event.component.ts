import { Component, Input } from '@angular/core';
import { Event } from '../../services/events';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() event: Event = {
    description_short: null,
    id: null,
    imageURL: null,
    images: null,
    start_datetime: null,
    title: null,
    url: null
  };
}
