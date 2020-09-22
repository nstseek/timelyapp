import { Component, OnInit } from '@angular/core';

interface Event {
  title: string;
  startDate: Date;
  description: string;
  image: null;
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
