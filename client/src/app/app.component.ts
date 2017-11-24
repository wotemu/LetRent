import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './security/auth.service';
import { ToastsManager } from 'ng2-toastr';
import { ChatService } from './services/chat.service';
import { NotificationService } from './services/notification.service';
import { CommentService } from 'app/services/comment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private routeSub: any;
  query: string;
  totalCommentNotifications: number;
  totalMessageNotifications: number;
  showLogin = false;
  showRegistration = false;
  currentYear = new Date().getFullYear();

  constructor(public auth: AuthService,
              private notification: NotificationService,
              private chatService: ChatService,
              private toastManager: ToastsManager,
              private vcr: ViewContainerRef,
              private route: ActivatedRoute,
              private commentService: CommentService) {
    this.toastManager.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.query = params['q'];
    });

    if (this.auth.loggedIn()) {
      this.getMessageNotificationsCount();
      this.getCommentNotificationsCount();
    }
  }

  /**
   * Change status of login form according to status of child component.
   * @param status: Status of form
   */
  changeLoginStatus(status: boolean) {
    this.getMessageNotificationsCount();
    this.getCommentNotificationsCount();
    this.showLogin = status;
  }

  /**
   * Change status of registration form according to status of child component.
   * @param status: Status of form
   */
  changeRegistrationStatus(status: boolean) {
    this.showRegistration = status;
  }

  /**
   * Show and hide login form.
   */
  showAndHideLogin() {
    this.showLogin = !this.showLogin;
  }

  /**
   * Show and hide registration form.
   */
  showAndHideRegistration() {
    this.showRegistration = !this.showRegistration;
  }

  /**
   * Set notifications as read.
   */
  onCommentRead() {
    this.totalCommentNotifications = 0;
  }

  getMessageNotificationsCount(): void {
    this.chatService.getTotalNotifications()
        .then((data) => {
          this.totalMessageNotifications = data as number;
        })
        .catch((e) => this.notification.errorResp(e));
  }

  getCommentNotificationsCount() {
    this.commentService.getCommentNotificationCount()
        .then((data) => {
          this.totalCommentNotifications = data;
        })
        .catch((e) => this.notification.errorResp(e));
  }

  goToAddProperty(event): void {
    if (!this.auth.loggedIn()) {
      this.notification.error('Please login to see your profile page!');
      event.stopPropagation();
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
