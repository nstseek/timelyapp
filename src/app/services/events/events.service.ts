import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpResponse, Image } from '../core/types';
import { Subject } from 'rxjs';

/** Defines the default API interface used to send events.
 *
 * An additional optional prop called imageURL was created to facilitate displaying images.
 */
export interface Event {
  imageURL?: string;
  images: Image[];
  start_datetime: string;
  title: string;
  description_short: string;
  id: number;
  url: string;
}

/** Defines the default API response when retrieving events. */
interface EventsResponse {
  total: number;
  from: number;
  size: number;
  has_prior: boolean;
  has_next: boolean;
  items: Event[];
}

/** Service created to fetch event data from API. */
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private http: HttpClient) {}

  /**
   * Parses the image array returned from the API into a single URL to be used as `src` in a `<img>` HTML component.
   * @param event The event that contains (or do not contain) an image.
   */
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

  /**
   * Makes the request to the API fetching new events and parses the `imageURL` using the private `parseImageURL` function.
   * @param page Sets the actual page index.
   * @param pageSize Sets the actual page size.
   * @param startDate Sets the start date to filter. (when appliable)
   * @param category Sets the category to filter. (when appliable)
   * @param tag Sets the tag to filter. (when appliable)
   */
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
