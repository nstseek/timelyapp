import { Component, OnInit } from '@angular/core';
import { Event, EventsService } from './services/events';
import { Taxonomy } from './services/taxonomies';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FiltersComponent } from './components/filters/filters.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /** Controls loading state. (spinner) */
  loading = false;
  /** Holds all filter data to be used in future requests. */
  filters: { category: Taxonomy; tag: Taxonomy; start_date: Date } = {
    category: null,
    start_date: null,
    tag: null
  };
  /** Holds events rendered at the moment. */
  events: {
    data: Event[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  } = {
    data: [],
    page: 1,
    pageSize: 15,
    totalPages: 1,
    totalItems: 1
  };

  constructor(
    private eventsService: EventsService,
    private filterDialog: MatDialog
  ) {}

  /**
   * Manages filter modal logic, filling the modal's forms and handling the return value from the modal.
   */
  openFilters() {
    const filterDialogRef = this.filterDialog.open(FiltersComponent);
    if (this.filters.category) {
      filterDialogRef.componentInstance.category.patchValue(
        this.filters.category.title
      );
    }
    if (this.filters.tag) {
      filterDialogRef.componentInstance.tag.patchValue(this.filters.tag.title);
    }
    if (this.filters.start_date) {
      filterDialogRef.componentInstance.startDate.patchValue(
        this.filters.start_date
      );
    }
    filterDialogRef.afterClosed().subscribe((data) => {
      this.filters = {
        ...this.filters,
        ...data
      };
      this.fetchEvents();
    });
  }

  /**
   * Refreshes the component data with new events requested from the API.
   */
  fetchEvents() {
    this.loading = true;
    this.eventsService
      .getEvents(
        this.events.page,
        this.events.pageSize,
        this.filters.start_date ? this.filters.start_date : null,
        this.filters.category ? this.filters.category.id : null,
        this.filters.tag ? this.filters.tag.id : null
      )
      .subscribe((response) => {
        this.events = {
          ...this.events,
          data: response.data.items,
          totalPages: Math.ceil(response.data.total / response.data.size),
          totalItems: response.data.total
        };
        this.loading = false;
      });
  }

  /**
   * Handles events emitted from the pagination component.
   * @param event Contains the updated data from pagination component
   */
  eventPageChange(event: PageEvent) {
    this.events = {
      ...this.events,
      page: event.pageIndex,
      pageSize: event.pageSize
    };
    this.fetchEvents();
  }

  /** Fetches events from API. */
  ngOnInit() {
    this.fetchEvents();
  }
}
