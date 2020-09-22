import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpResponse, Image } from '../core/types';

export interface Taxonomy {
  id: number;
  title: string;
  color: string;
  image?: Image[];
}

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

@Injectable({
  providedIn: 'root'
})
export class TaxonomiesService {
  constructor(private http: HttpClient) {}

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
