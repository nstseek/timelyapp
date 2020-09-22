import { Component, OnInit, EventEmitter } from '@angular/core';
import { Event, EventsService } from './services/events';
import { Taxonomy, TaxonomiesService } from './services/taxonomies';
import { forkJoin } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FiltersComponent } from './components/filters/filters.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = false;
  filters: { category: Taxonomy; tag: Taxonomy; start_date: Date } = {
    category: null,
    start_date: null,
    tag: null
  };
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
      console.log(data);
      console.log(this.filters);
      this.fetchEvents();
    });
  }

  fetchEvents() {
    this.loading = true;
    const eventsRequest = this.eventsService.getEvents(
      this.events.page,
      this.events.pageSize,
      this.filters.start_date ? this.filters.start_date : null,
      this.filters.category ? this.filters.category.id : null,
      this.filters.tag ? this.filters.tag.id : null
    );
    eventsRequest.subscribe((response) => {
      this.events = {
        ...this.events,
        data: response.data.items,
        totalPages: Math.ceil(response.data.total / response.data.size),
        totalItems: response.data.total
      };
      this.loading = false;
    });
  }

  eventPageChange(event: PageEvent) {
    this.events = {
      ...this.events,
      page: event.pageIndex,
      pageSize: event.pageSize
    };
    this.fetchEvents();
  }

  ngOnInit() {
    this.fetchEvents();
  }
}
