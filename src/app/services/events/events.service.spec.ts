import { TestBed, getTestBed } from '@angular/core/testing';

import { EventsService } from './events.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('EventsService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: EventsService = TestBed.get(EventsService);
    expect(service).toBeTruthy();
  });
  it('should make a request to external API using pagination parameters', () => {
    const service: EventsService = TestBed.get(EventsService);
    service.getEvents(1, 15);
    const req = httpMock.expectOne(
      'https://timelyapp.time.ly/api/calendars/4243455/events?page=1&per_page=15'
    );
    expect(req).toBeTruthy();
  });
  it('should make a request to external API using start date filter parameters', () => {
    const service: EventsService = TestBed.get(EventsService);
    service.getEvents(1, 15, new Date());
    const req = httpMock.expectOne(
      `https://timelyapp.time.ly/api/calendars/4243455/events?page=1&per_page=15&start_date=${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`
    );
    expect(req).toBeTruthy();
  });
  it('should make a request to external API using category filter parameters', () => {
    const service: EventsService = TestBed.get(EventsService);
    service.getEvents(1, 15, null, 1);
    const req = httpMock.expectOne(
      `https://timelyapp.time.ly/api/calendars/4243455/events?page=1&per_page=15&categories=${1}`
    );
    expect(req).toBeTruthy();
  });
  it('should make a request to external API using tag filter parameters', () => {
    const service: EventsService = TestBed.get(EventsService);
    service.getEvents(1, 15, null, null, 1);
    const req = httpMock.expectOne(
      `https://timelyapp.time.ly/api/calendars/4243455/events?page=1&per_page=15&tags=${1}`
    );
    expect(req).toBeTruthy();
  });
});
