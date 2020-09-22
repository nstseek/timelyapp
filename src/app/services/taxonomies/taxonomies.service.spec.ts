import { TestBed, getTestBed } from '@angular/core/testing';
import { TaxonomiesService } from './taxonomies.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('TaxonomiesService', () => {
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
    const service: TaxonomiesService = TestBed.get(TaxonomiesService);
    expect(service).toBeTruthy();
  });
});
