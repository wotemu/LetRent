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

  getTotalNotifications(): Promise<any> {
    return this.authHttp
        .get(endpoint + 'total-notifications/')
        .toPromise()
        .then((response: Response) => {
          return response.json()['totalNotifications'];
        });
  }

  getChat(chatId: number): Promise<Chat> {
    return this.authHttp
        .get(endpoint + chatId + '/')
        .toPromise()
        .then((response: Response) => response.json() as Chat);
  }

  getChats(): Promise<any> {
    return this.authHttp
        .get(endpoint)
        .toPromise()
        .then((response: Response) => {
          return response.json();
        });
  }

  getMessages(chatId: number): Promise<any> {
    return this.authHttp
        .get(endpoint + chatId + '/messages/')
        .toPromise()
        .then((response: Response) => {
          return response.json();
        });
  }

  sendMessage(chatId: number, message: string): Promise<any> {
    return this.authHttp
        .post(endpoint + chatId + '/add-message/', {
          'message': message
        })
        .toPromise()
        .then((response: Response) => {
          return response.json();
        });
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
        });
  }
}
