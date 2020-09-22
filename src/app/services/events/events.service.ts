import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpResponse, Image } from '../core/types';

export interface Event {
  images: Image[];
  start_datetime: string;
  title: string;
  description_short: string;
  id: number;
  url: string;
}

export interface EventsResponse {
  total: number;
  from: number;
  size: number;
  has_prior: boolean;
  has_next: boolean;
  items: Event[];
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private http: HttpClient) {}

  getEvents(
    page: number,
    pageSize: number,
    startDate?: Date,
    category?: number,
    tag?: number
  ) {
    let params = new HttpParams()
      .append('page', page.toString())
      .append('per_page', pageSize.toString());
    if (startDate) {
      params = params.append(
        'start_date',
        `${startDate.getFullYear()}-${
          startDate.getMonth() + 1
        }-${startDate.getDate()}`
      );
    }
    if (category) {
      params = params.append('categories', category.toString());
    }
    if (tag) {
      params = params.append('tags', tag.toString());
    }
    return this.http.get<HttpResponse<EventsResponse>>(
      'https://timelyapp.time.ly/api/calendars/4243455/events'
    );
  }
}
