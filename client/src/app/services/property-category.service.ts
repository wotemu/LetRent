import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { PropertyCategory } from '../models/property-category';
import { Helper } from '../utils/helper';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class PropertyCategoryService {
  private endpoint = '/api/property-categories/';

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private helper: Helper) {
  }

  getPropertyCategories() {
    // return this.authHttp
    return this.http
        .get(this.endpoint)
        .toPromise()
        .then((response: Response) => {
          console.log(response);
          return response.json() as PropertyCategory[];
        })
        .catch(this.helper.handlePromiseError);
  }
}
