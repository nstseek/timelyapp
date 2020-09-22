import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadingComponent } from './components/ui/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EventComponent } from './components/event/event.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { not } from '@angular/compiler/src/output/output_ast';
import { EventsService } from './services/events';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const startDatePatchValueMock = jest.fn();
  const tagPatchValueMock = jest.fn();
  const categoryPatchValueMock = jest.fn();
  const afterClosedSubMock = jest.fn();
  const afterClosedMock = jest
    .fn()
    .mockReturnValue({ subscribe: afterClosedSubMock });
  const openDialogMock = jest.fn().mockReturnValue({
    afterClosed: afterClosedMock,
    componentInstance: {
      startDate: { patchValue: startDatePatchValueMock },
      category: { patchValue: categoryPatchValueMock },
      tag: { patchValue: tagPatchValueMock }
    }
  });
  const eventsServiceMock = {
    getEvents: jest.fn().mockReturnValue(new Subject())
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, LoadingComponent, EventComponent],
      imports: [
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatCardModule,
        MatDialogModule,
        HttpClientModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: openDialogMock
          }
        },
        { provide: EventsService, useValue: eventsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch events on init cycle', () => {
    expect(eventsServiceMock.getEvents).toHaveBeenCalled();
  });
  it('should open dialog', () => {
    component.openFilters();
    expect(openDialogMock).toHaveBeenCalled();
  });
  it('should set up a listener to get the modal result', () => {
    expect(afterClosedMock).toHaveBeenCalled();
    expect(afterClosedSubMock).toHaveBeenCalled();
  });
  it('should not patch start date if it is not present', () => {
    component.openFilters();
    expect(startDatePatchValueMock).not.toHaveBeenCalled();
  });
  it('should not patch tag if it is not present', () => {
    component.openFilters();
    expect(tagPatchValueMock).not.toHaveBeenCalled();
  });
  it('should not patch category if it is not present', () => {
    component.openFilters();
    expect(categoryPatchValueMock).not.toHaveBeenCalled();
  });
  it('should fetch events without filters', () => {
    component.fetchEvents();
    expect(eventsServiceMock.getEvents).toHaveBeenCalledWith(
      component.events.page,
      component.events.pageSize,
      null,
      null,
      null
    );
  });
  it('should patch start date if it is present', () => {
    component.filters.start_date = new Date();
    component.openFilters();
    expect(startDatePatchValueMock).toHaveBeenCalled();
  });
  it('should fetch events with start date only', () => {
    component.fetchEvents();
    expect(eventsServiceMock.getEvents).toHaveBeenCalledWith(
      component.events.page,
      component.events.pageSize,
      component.filters.start_date,
      null,
      null
    );
  });
  it('should patch tag if it is present', () => {
    component.filters.tag = { color: '', id: 0, title: '' };
    component.openFilters();
    expect(tagPatchValueMock).toHaveBeenCalled();
  });
  it('should fetch events with start date and tag', () => {
    component.filters.start_date = new Date();
    component.filters.tag = { color: '', id: 0, title: '' };
    eventsServiceMock.getEvents.mockClear();
    component.fetchEvents();
    expect(eventsServiceMock.getEvents).toHaveBeenCalledWith(
      component.events.page,
      component.events.pageSize,
      component.filters.start_date,
      null,
      component.filters.tag.id
    );
  });
  it('should patch category if it is present', () => {
    component.filters.category = { color: '', id: 0, title: '' };
    component.openFilters();
    expect(categoryPatchValueMock).toHaveBeenCalled();
  });
  it('should fetch events with start date, tag and category', () => {
    component.filters.start_date = new Date();
    component.filters.tag = { color: '', id: 0, title: '' };
    component.filters.category = { color: '', id: 0, title: '' };
    component.fetchEvents();
    expect(eventsServiceMock.getEvents).toHaveBeenCalledWith(
      component.events.page,
      component.events.pageSize,
      component.filters.start_date,
      component.filters.category.id,
      component.filters.tag.id
    );
  });
});
