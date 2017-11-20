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
    return this.authHttp
        .get(endpoint)
        .toPromise()
        .then((response: Response) => {
          return response.json();
        })
        // .catch(this.helper.handlePromiseError);
        ;
  }

  getMessages(chatId: number): Promise<any> {
    return this.authHttp
        .get(endpoint + chatId + '/messages/')
        .toPromise()
        .then((response: Response) => {
          return response.json();
        })
        .catch(this.helper.handlePromiseError);
  }

  sendMessage(chatId: number, message: string): Promise<any> {
    return this.authHttp
        .post(endpoint + chatId + '/add-message/', {
          'message': message
        })
        .toPromise()
        .then((response: Response) => {
          return response.json();
        })
        .catch(this.helper.handlePromiseError);
  }

  createChat(propertyId: number, message?: string): Promise<any> {
    return this.authHttp
        .post(endpoint + 'create/', {
          'property_id': propertyId,
          'message': message
        })
        .toPromise()
        .then((response: Response) => {
          return response.json();
        })
        .catch(this.helper.handlePromiseError);
  }
}
