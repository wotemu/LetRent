import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Property } from '../models/property';
import { Helper } from '../utils/helper';
import { AuthHttp } from 'angular2-jwt';

const endpoint = '/api/properties/';
const endpointAddProperty = '/api/property-modification/';
const endpointProfileProperty = '/api/profile-properties/';

@Injectable()
export class PropertyService {
  constructor(private http: Http,
    private helper: Helper,
    private authHttp: AuthHttp) {
  }

  getProperty(slug: string): Promise<Property> {
    return this.http
      .get(endpoint + slug + '/')
      .toPromise()
      .then((response: Response) => response.json() as Property)
      .catch(this.helper.handlePromiseError);
  }

  getProperties(requestParams?: {}): Promise<any> {
    return this.http
      .get(endpoint, {
        search: Helper.buildURLSearchParamsFromDict(requestParams)
      })
      .toPromise()
      .then((response: Response) => response.json())
      .catch(this.helper.handlePromiseError);
  }

  getProfileProperties(): Promise<any> {
    return this.authHttp
      .get(endpointProfileProperty)
      .toPromise()
      .then((response: Response) => response.json())
      .catch(this.helper.handlePromiseError);
  }

  search(query: string) {
    const queryString = `?q=${query}`;
    return this.http.get(endpoint + queryString)
      .map((response) => response.json())
      .catch(this.helper.handleObservableError);
  }

  addProperty(property) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(endpointAddProperty, property)
        .map((res) => res.json())
        .subscribe(
        (data) => {
          resolve();
        },
        (error) => {
          reject(error);
        }
        );
    });
  }

  editProperty(property, id) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(endpointAddProperty + id + '/', property)
        .map((res) => res.json())
        .subscribe(
        (data) => {
          resolve();
        },
        (error) => {
          reject(error);
        }
        );
    });
  }

  deleteProperty(id: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(endpointAddProperty + id + '/')
        .map((res) => res.json())
        .subscribe(
        (data) => {
          resolve();
        },
        (error) => {
          reject(error);
        }
        );
    });
  }
}
