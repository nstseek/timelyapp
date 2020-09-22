import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpResponse, Image } from '../core/types';

/** Defines the default taxonomy interface used by the API. */
export interface Taxonomy {
  id: number;
  title: string;
  color: string;
  image?: Image[];
}

/** Defines the default response used by the API when fetching taxonomies */
interface TaxonomiesResponse {
  id: number;
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  items: Taxonomy[];
}

/** Service created to fetch taxonomy data from the API. */
@Injectable({
  providedIn: 'root'
})
export class TaxonomiesService {
  constructor(private http: HttpClient) {}

  /**
   * Fetches tags available on the server
   * @param page Sets the actual page index
   * @param pageSize Sets the actual page size
   */
  getTags(page: number, pageSize: number) {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('per_page', pageSize.toString())
      .append('type', 'taxonomy_tag');
    return this.http.get<HttpResponse<TaxonomiesResponse>>(
      'https://timelyapp.time.ly/api/calendars/4243455/taxonomies',
      { params }
    );
  }

  /**
   * Fetches categories available on the server
   * @param page Sets the actual page index
   * @param pageSize Sets the actual page size
   */
  getCategories(page: number, pageSize: number) {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('per_page', pageSize.toString())
      .append('type', 'taxonomy_category');
    return this.http.get<HttpResponse<TaxonomiesResponse>>(
      'https://timelyapp.time.ly/api/calendars/4243455/taxonomies',
      { params }
    );
  }
}
