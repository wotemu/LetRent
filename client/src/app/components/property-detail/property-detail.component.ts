import { Component, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property';
import { NotificationService } from '../../services/notification.service';
import { Location } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat';
import { AuthService } from '../../security/auth.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: 'property-detail.component.html',
  styleUrls: ['property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  property: Property;
  slug: string;
  chat: Chat;
  question = '';
  showLinkToChat = false;
  isOwner = false;
  sending = false;

  @ViewChildren('questionInput') questionInputVC;

  constructor(private route: ActivatedRoute,
              private auth: AuthService,
              private notification: NotificationService,
              private location: Location,
              private router: Router,
              private chatService: ChatService,
              private propertyService: PropertyService) {
  }

  ngOnInit() {
    this.slug = this.route.snapshot.params['slug'];

    this.propertyService.getProperty(this.slug)
        .then((data) => {
          this.property = data as Property;
          if ('chat' in data) {
            this.chat = data['chat'] as Chat;
            this.showLinkToChat = true;
          }
        })
        .catch((e) => this.notification.errorResp(e));
  }

  onContactRenter(event): void {
    if (!this.question) return;

    if (!this.auth.user) {
      this.notification.warning('You have to log in in order to contact Renter.');
      return;
    }

    this.sending = true;
    this.chatService.createChat(this.property.id, this.question)
        .then((data) => {
          this.sending = false;
          this.chat = data as Chat;

          this.router.navigate(['/chats', {chatId: this.chat.id}]);
        })
        .catch((e) => this.notification.errorResp(e));
  }

  onUpdateQuestion(event, newQuestion): void {
    this.question = newQuestion;
    event.stopPropagation();

    // Put focus on elnt back
    this.questionInputVC.first.nativeElement.focus();
  }

  goToChat(event): void {
    event.stopPropagation();
    if (this.chat) {
      this.router.navigate(['/chats', {chatId: this.chat.id}]);
    }
  }

  goBack(): boolean {
    this.location.back();
    return false;
  }
}
