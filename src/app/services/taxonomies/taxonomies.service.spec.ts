import { TestBed } from '@angular/core/testing';

import { TaxonomiesService } from './taxonomies.service';
import { HttpClientModule } from '@angular/common/http';

describe('TaxonomiesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should be created', () => {
    const service: TaxonomiesService = TestBed.get(TaxonomiesService);
    expect(service).toBeTruthy();
  });
});
