import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PropertyCategory } from '../models/property-category';
import { Helper } from '../utils/helper';

@Injectable()
export class PropertyCategoryService {
  private endpoint = '/api/property-categories/';

  constructor(private http: Http,
              private helper: Helper) {
  }

  getPropertyCategories() {
    return this.http
        .get(this.endpoint)
        .toPromise()
        .then((response: Response) => response.json() as PropertyCategory[]);
  }
}
