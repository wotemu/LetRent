/**
 * Created by Leo on 10/13/2017.
 */
import { NotificationService } from '../services/notification.service';
import { Injectable } from '@angular/core';
import { URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class Helper {
  static buildURLSearchParamsFromDict(requestParamsDict: {}): URLSearchParams {
    const params = new URLSearchParams();
    for (let key in requestParamsDict) {
      params.set(key, requestParamsDict[key]);
    }
    return params;
  }

  constructor(private notification: NotificationService) {
  }

  public handlePromiseError(error: any): Promise<any> {
    this.notification.errorResp(error);
    return Promise.reject(error.text() || error);
  }

  public handleObservableError(error: any): ErrorObservable {
    let errMsg = 'Server error occurred please try again.';
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || '' } - ${err}`;
    }
    this.notification.error(error);
    return Observable.throw(errMsg);
  }
}
