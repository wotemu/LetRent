import { Injectable, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Helper } from '../utils/helper';
import { Chat } from '../models/chat';
import { AuthHttp } from 'angular2-jwt';
import { NotificationService } from '../services/notification.service';
import 'rxjs/add/operator/map';

const endpoint = '/api/comment/';
const endpointGet = '/api/get-comments/';
const endpointCount = '/api/get-comment-count/';

@Injectable()
export class CommentService{
    constructor(private authHttp: AuthHttp,
        private http: Http,
        private helper: Helper,
        private notificationService: NotificationService) { }

    createComment(propertyId: number, message: string) {
        return this.authHttp.post(endpoint, {
            'property_id': propertyId,
            'message_body': message
        })
            .toPromise()
            //.catch(this.helper.handlePromiseError);
    }

    getComments(propertyId: number) {
        return this.http.post(endpointGet, {
            'property_id': propertyId,
        })
            .toPromise()
            .then((response) => response.json())
            //.catch(this.helper.handlePromiseError);
    }

    getCommentNotifications() {
        return this.authHttp.get(endpoint)
            .toPromise()
            .then((response) => response.json())
            //.catch(this.helper.handlePromiseError);
    }

    getCommentNotificationCount() {
        return this.authHttp.get(endpointCount)
            .toPromise()
            .then((response) => response.json())
            //.catch(this.helper.handlePromiseError);
    }

    setCommentsAsRead() {
        return this.authHttp.post(endpointCount, {})
            .toPromise()
            .then((response) => response.text())
            //  .catch(this.helper.handlePromiseError);
    }
}