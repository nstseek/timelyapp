import { Component, OnInit } from '@angular/core';
import { Taxonomy, TaxonomiesService } from 'src/app/services/taxonomies';
import { FormControl } from '@angular/forms';
import _ from 'lodash';

/** Displays a modal to set up filters for events. */
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  /** Controls category data loading state. */
  categoryLoading = false;
  /** Controls tag data loading state. */
  tagLoading = false;
  /** Holds category form reference. */
  category = new FormControl();
  /** Holds tag form reference. */
  tag = new FormControl();
  /** Holds start date form reference. */
  startDate = new FormControl();
  /** Stores filtered categories to be displayed on autocomplete based on what user typed. */
  filteredCategories: Taxonomy[] = [];
  /** Stores filtered tags to be displayed on autocomplete based on what user typed. */
  filteredTags: Taxonomy[] = [];
  /** Stores all categories retrieved from API. */
  categories: {
    data: Taxonomy[];
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
  /** Stores all tags retrieved from API. */
  tags: {
    data: Taxonomy[];
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
  constructor(private taxonomiesService: TaxonomiesService) {}

  /** Evaluates the component state and composes an object to sent as the modal's result value. */
  get filters() {
    if (this.tags.data && this.categories.data) {
      return {
        tag: this.tag.value
          ? this.tags.data.find(
              (tag) =>
                _.lowerCase(tag.title).indexOf(_.lowerCase(this.tag.value)) !==
                -1
            )
          : null,
        category: this.category.value
          ? this.categories.data.find(
              (category) =>
                _.lowerCase(category.title).indexOf(
                  _.lowerCase(this.category.value)
                ) !== -1
            )
          : null,
        start_date: this.startDate.value ? new Date(this.startDate.value) : null
      };
    }
    return {
      tag: null,
      category: null,
      start_date: null
    };
  }

  /** Fetches all tags from API. */
  fetchTags() {
    this.tagLoading = true;
    this.taxonomiesService
      .getTags(this.tags.page, this.tags.pageSize)
      .subscribe((response) => {
        if (response.data.total !== this.tags.pageSize) {
          this.tags.pageSize = response.data.total;
          this.fetchTags();
        } else {
          this.tags = {
            ...this.tags,
            data: response.data.items,
            totalPages: response.data.last_page,
            totalItems: response.data.total
          };
          this.filteredTags = this.tags.data;
          this.tagLoading = false;
        }
      });
  }

  /** Fetches all categories from API. */
  fetchCategories() {
    this.categoryLoading = true;
    this.taxonomiesService
      .getCategories(this.categories.page, this.categories.pageSize)
      .subscribe((response) => {
        if (response.data.total !== this.categories.pageSize) {
          this.categories.pageSize = response.data.total;
          this.fetchCategories();
        } else {
          this.categories = {
            ...this.categories,
            data: response.data.items,
            totalPages: response.data.last_page,
            totalItems: response.data.total
          };
          this.filteredCategories = this.categories.data;
          this.categoryLoading = false;
        }
      });
  }

  /** Fetches categories and tags from API and sets up listeners on FormControls to watch user input and provide auto completion. */
  ngOnInit() {
    this.fetchCategories();
    this.fetchTags();
    this.category.valueChanges.subscribe((data) => {
      this.filteredCategories = this.categories.data.filter((category) =>
        data
          ? _.lowerCase(category.title).indexOf(_.lowerCase(data)) !== -1
          : true
      );
    });
    this.tag.valueChanges.subscribe((data) => {
      this.filteredTags = this.tags.data.filter((tag) =>
        data ? _.lowerCase(tag.title).indexOf(_.lowerCase(data)) !== -1 : true
      );
    });
  }
}
