import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Property } from '../models/property';
import { Helper } from '../utils/helper';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../security/auth.service';

const endpoint = '/api/properties/';

@Injectable()
export class PropertyService {
  constructor(private auth: AuthService,
              private http: Http,
              private authHttp: AuthHttp,
              private helper: Helper) {
  }

  getProperty(slug: string): Promise<Property> {
    const request = this.auth.user ? this.authHttp : this.http;
    return request
        .get(endpoint + slug + '/')
        .toPromise()
        .then((response: Response) => response.json() as Property)
        // .catch(this.helper.handlePromiseError);
    ;
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

  search(query: string) {
    const queryString = `?q=${query}`;
    return this.http.get(endpoint + queryString)
      .map((response) => response.json())
      .catch(this.helper.handleObservableError);
  }
}
