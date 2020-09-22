import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpResponse, Image } from '../core/types';
import { Subject } from 'rxjs';

export interface Event {
  imageURL?: string;
  images: Image[];
  start_datetime: string;
  title: string;
  description_short: string;
  id: number;
  url: string;
}

interface EventsResponse {
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

  private parseImageURL(event: Event): string {
    let url;
    if (event && event.images && event.images.length) {
      event.images.find((image) => {
        Object.keys(image.sizes).find((key) => {
          if (image.sizes[key].url) {
            url = image.sizes[key].url;
            return true;
          }
          return false;
        });
        return !!url;
      });
      return url ? url : 'https://picsum.photos/250';
    } else {
      return 'https://picsum.photos/250';
    }
  }

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
    const subject = new Subject<HttpResponse<EventsResponse>>();
    this.http
      .get<HttpResponse<EventsResponse>>(
        'https://timelyapp.time.ly/api/calendars/4243455/events',
        { params }
      )
      .subscribe(
        (response) => {
          response.data.items = response.data.items.map(
            (item): Event => {
              return {
                ...item,
                imageURL: this.parseImageURL({ ...item })
              };
            }
          );
          subject.next(response);
        },
        () => {},
        () => {
          subject.complete();
        }
      );
    return subject;
  }
}
