import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Helper } from '../utils/helper';
import { Chat } from '../models/chat';
import { AuthHttp } from 'angular2-jwt';

const endpoint = '/api/chats/';

@Injectable()
export class ChatService {
  constructor(private http: Http,
              private authHttp: AuthHttp,
              private helper: Helper) {
  }

  getChat(chatId: number): Promise<Chat> {
    return this.authHttp
        .get(endpoint + chatId + '/')
        .toPromise()
        .then((response: Response) => response.json() as Chat)
        .catch(this.helper.handlePromiseError);
  }

  getChats(): Promise<any> {
    // TODO: Get current user id (on backend)
    return this.authHttp
        .get(endpoint)
        .toPromise()
        .then((response: Response) => {
          console.log(response);
          return response.json();
        })
        // .catch(this.helper.handlePromiseError);
        ;
  }

}
