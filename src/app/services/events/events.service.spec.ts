import { TestBed } from '@angular/core/testing';

import { EventsService } from './events.service';
import { HttpClientModule } from '@angular/common/http';

describe('EventsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should be created', () => {
    const service: EventsService = TestBed.get(EventsService);
    expect(service).toBeTruthy();
  });
});
