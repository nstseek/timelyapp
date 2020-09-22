import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed
} from '@angular/core/testing';

import { FiltersComponent } from './filters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TaxonomiesService } from 'src/app/services/taxonomies';
import { Subject } from 'rxjs';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  const mockCategoryObservable = jest.fn();
  const mockTagsObservable = jest.fn();

  const taxonomiesService = {
    getTags: jest.fn().mockReturnValue(new Subject()),
    getCategories: jest.fn().mockReturnValue(new Subject())
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      imports: [
        MatDatepickerModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatInputModule,
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [{ provide: TaxonomiesService, useValue: taxonomiesService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    component.category.valueChanges.subscribe = mockCategoryObservable;
    component.tag.valueChanges.subscribe = mockTagsObservable;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should fetch tags data from the API on init cycle', () => {
    expect(taxonomiesService.getTags).toHaveBeenCalled();
  });
  it('it should fetch categories data from the API on init cycle', () => {
    expect(taxonomiesService.getCategories).toHaveBeenCalled();
  });
  describe('Autocomplete', () => {
    it('should set up a subscription to filter the auto completion on category field', () => {
      expect(mockCategoryObservable).toHaveBeenCalled();
    });
    it('should set up a subscription to filter the auto completion on tag field', () => {
      expect(mockTagsObservable).toHaveBeenCalled();
    });
  });
  it('it should fetch tags data from the API', () => {
    taxonomiesService.getTags.mockReset();
    taxonomiesService.getTags.mockReturnValue(new Subject());
    component.fetchTags();
    expect(taxonomiesService.getTags).toHaveBeenCalled();
  });
  it('it should fetch categories data from the API', () => {
    taxonomiesService.getCategories.mockReset();
    taxonomiesService.getCategories.mockReturnValue(new Subject());
    component.fetchCategories();
    expect(taxonomiesService.getCategories).toHaveBeenCalled();
  });
  it('should return null filters without data', () => {
    expect(component.filters).toEqual({
      tag: null,
      category: null,
      start_date: null
    });
  });
  it('should return null start date when start date has no data', () => {
    component.tags.data = [{ title: '', id: 0, color: '' }];
    component.categories.data = [{ title: '', id: 0, color: '' }];
    expect(component.filters.start_date).toEqual(null);
  });
  it('should return null tag when tag has no data', () => {
    component.tags.data = [{ title: '', id: 0, color: '' }];
    component.categories.data = [{ title: '', id: 0, color: '' }];
    expect(component.filters.tag).toEqual(null);
  });
  it('should return null category when category has no data', () => {
    component.tags.data = [{ title: '', id: 0, color: '' }];
    component.categories.data = [{ title: '', id: 0, color: '' }];
    expect(component.filters.category).toEqual(null);
  });
});
