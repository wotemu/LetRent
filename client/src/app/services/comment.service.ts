import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

const endpoint = '/api/comment/';
const endpointGet = '/api/get-comments/';
const endpointCount = '/api/get-comment-count/';

@Injectable()
export class CommentService {
  constructor(private http: Http,
              private authHttp: AuthHttp) {
  }

  createComment(propertyId: number, message: string) {
    return this.authHttp
        .post(endpoint, {
          'property_id': propertyId,
          'message_body': message
        })
        .toPromise();
  }

  getComments(propertyId: number) {
    return this.http.post(endpointGet, {'property_id': propertyId})
        .toPromise()
        .then((response) => response.json());
  }

  getCommentNotifications() {
    return this.authHttp.get(endpoint)
        .toPromise()
        .then((response) => response.json());
  }

  getCommentNotificationCount() {
    return this.authHttp.get(endpointCount)
        .toPromise()
        .then((response) => response.json());
  }

  setCommentsAsRead() {
    return this.authHttp.post(endpointCount, {})
        .toPromise()
        .then((response) => response.text());
  }
}
