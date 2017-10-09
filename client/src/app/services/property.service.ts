import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Property } from '../models/property';
import { NotificationService } from './notification.service';

@Injectable()
export class PropertyService {
  private endpoint = '/api/properties/';

  constructor(private http: Http,
              private notificationService: NotificationService) {
  }

  getProperties(requestParams?: {}): Promise<Property[]> {
    return this.http
        .get(this.endpoint)
        .toPromise()
        .then((response: Response) => response.json() as Property[])
        .catch(this.handleError);
  }

  getProperty(slug: string): Promise<Property> {
    return this.http
        .get(this.endpoint + slug + '/')
        .toPromise()
        .then((response: Response) => response.json() as Property)
        .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    this.notificationService.error(error);
    return Promise.reject(error.text() || error);
  }
}
