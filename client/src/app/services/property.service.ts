import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Property } from '../models/property';
import { Helper } from '../utils/helper';

const endpoint = '/api/properties/';

@Injectable()
export class PropertyService {
  constructor(private http: Http,
              private helper: Helper) {
  }

  getProperty(slug: string): Promise<Property> {
    return this.http
        .get(endpoint + slug + '/')
        .toPromise()
        .then((response: Response) => response.json() as Property)
        .catch(this.helper.handlePromiseError);
  }

  getProperties(requestParams?: {}): Promise<Property[]> {
    return this.http
        .get(endpoint, {
          search: Helper.buildURLSearchParamsFromDict(requestParams)
        })
        .toPromise()
        .then((response: Response) => response.json() as Property[])
        .catch(this.helper.handlePromiseError);
  }

  search(query: string) {
    const queryString = `?q=${query}`;
    return this.http.get(endpoint + queryString)
      .map((response) => response.json())
      .catch(this.helper.handleObservableError);
  }
}
