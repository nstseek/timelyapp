import { Component, OnInit } from '@angular/core';
import { Taxonomy, TaxonomiesService } from 'src/app/services/taxonomies';
import { FormControl } from '@angular/forms';
import _ from 'lodash';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  categoryLoading = false;
  tagLoading = false;
  category = new FormControl();
  tag = new FormControl();
  startDate = new FormControl();
  filteredCategories: Taxonomy[] = [];
  filteredTags: Taxonomy[] = [];
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
      category: null
    };
  }

  fetchTags() {
    this.tagLoading = true;
    const tagsRequest = this.taxonomiesService.getTags(
      this.tags.page,
      this.tags.pageSize
    );
    tagsRequest.subscribe((response) => {
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

  fetchCategories() {
    this.categoryLoading = true;
    const categoriesRequest = this.taxonomiesService.getCategories(
      this.categories.page,
      this.categories.pageSize
    );
    categoriesRequest.subscribe((response) => {
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
