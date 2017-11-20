import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property.service';
import { Chat } from '../../models/chat';
import { Message } from '../../models/message';
import { ChatService } from '../../services/chat.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.component.html',
  styleUrls: ['chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy {
  chats: Chat[];
  selectedChat: Chat;
  messages: Message[];
  noChatSelected = true;
  totalChats = 0;

  private routeListener: any;
  // private requestListener: any;

  constructor(private route: ActivatedRoute,
              private chatService: ChatService,
              private notification: NotificationService) {
  }

  ngOnInit() {
    this.routeListener = this.route.params.subscribe((params) => {
      const chatId = params['chatId'];
      console.log('TODO: Add fetching chat messages by chatId');
      // this.requestListener = this.propertyService.search(this.query).subscribe((data) => {
      //   this.properties = data.results as Property[];
      //   this.noRecordsFound = !(data.results.length > 0);
      // });
    });
    this.chatService.getChats()
        .then((data) => {
          this.chats = data as Chat[];
          this.totalChats = this.chats.length;
          console.log(this.chats);
        })
        // .catch((e) => this.notification.errorResp(e));
    ;
  }

  ngOnDestroy() {
    this.routeListener.unsubscribe();
    // this.requestListener.unsubscribe();
  }
}
