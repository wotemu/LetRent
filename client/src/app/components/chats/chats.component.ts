import { Component, OnInit, OnDestroy, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../../models/chat';
import { Message } from '../../models/message';
import { ChatService } from '../../services/chat.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../security/auth.service';
import { Account } from '../../models/account';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.component.html',
  styleUrls: ['chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy, AfterViewInit {
  chats: Chat[];
  messages: Message[];
  totalChats = 0;
  totalMessages = 0;

  selectedChat: Chat;
  selectedChatId: number;
  currentUser: Account;
  receiverUser: Account;
  message: string;

  sending = false;
  private routeListener: any;

  @ViewChildren('messages') messagesDivListener: QueryList<any>;

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private router: Router,
              private notification: NotificationService) {
    // TODO: If user is not logged in redirect to main page
  }

  ngOnInit() {
    this.routeListener = this.route.params.subscribe((params) => {
      this.selectedChatId = params['chatId'];
      if (isNaN(this.selectedChatId) || !this.chats) {
        return;
      }

      const selectedChatObj = this.chats.filter((chat) => chat.id == this.selectedChatId)[0];
      this.updateSelectedChatMetaInfo(selectedChatObj);
      this.reloadChatMessages();
    });
    this.reloadChats();
  }

  ngAfterViewInit() {
    this.messagesDivListener.changes.subscribe(this.scrollToBottom);
  }

  getReceiverUser(chat: Chat): Account {
    if (this.auth.userId === chat.fromUser.id) {
      return chat.toUser;
    }
    return chat.fromUser;
  }

  updateSelectedChatMetaInfo(chat: Chat): void {
    this.selectedChatId = chat.id;
    this.selectedChat = chat;
    this.receiverUser = this.getReceiverUser(chat);
    this.currentUser = this.auth.userId === chat.fromUser.id ? chat.fromUser : chat.toUser;
  }

  reloadChats(): void {
    this.chatService.getChats()
        .then((data) => {
          this.chats = data as Chat[];
          this.totalChats = this.chats.length;

          if (this.selectedChatId) {
            const selectedChat = this.chats.filter((chat) => chat.id == this.selectedChatId)[0];
            this.updateSelectedChatMetaInfo(selectedChat);
            this.reloadChatMessages();
          }
        })
        .catch((e) => this.notification.errorResp(e));
  }

  reloadChatMessages() {
    if (!this.selectedChatId) return;

    this.chatService.getMessages(this.selectedChatId)
        .then((data) => {
          this.messages = data as Message[];
          this.totalMessages = this.messages.length;
        })
        .catch((e) => this.notification.errorResp(e));
  }

  onSelectChat(chat: Chat): void {
    if (this.selectedChatId == chat.id) return;

    this.updateSelectedChatMetaInfo(chat);
    this.router.navigate(['/chats', {chatId: chat.id}]);
  }

  onSendMessage(event) {
    this.sending = true;
    this.chatService.sendMessage(this.selectedChatId, this.message)
        .then((data) => {
          this.messages.push(data as Message);
          this.sending = false;
          this.totalMessages += 1;
          this.message = '';
        })
        .catch((e) => this.notification.errorResp(e));
  }

  scrollToBottom(): void {
    const element = document.getElementById('messages');
    try {
      element.scrollTop = element.scrollHeight;
    } catch (err) {
    }
  }

  isCurrentUserSender(message: Message): boolean {
    return this.auth.userId == message.fromUserId;
  }

  isOwner(): boolean {
    return this.selectedChat.toUser.id == this.auth.userId;
  }

  ngOnDestroy() {
    this.routeListener.unsubscribe();
    // this.messagesDivListener.changes.unsubscribe();
  }
}
