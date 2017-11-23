import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'app/security/auth.service';
import { CommentService } from 'app/services/comment.service';
import { Notification } from 'app/models/notification';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-notifications',
  templateUrl: './profile-notifications.component.html',
  styleUrls: ['./profile-notifications.component.css']
})
export class ProfileNotificationsComponent implements OnInit, OnDestroy {

  notifications: Notification[];

  constructor(private auth: AuthService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private router: Router) {

    if (!auth.loggedIn()) {
      this.router.navigate(['']);
      this.notificationService.info('You have already been authorized.');
    }
  }

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.commentService.setCommentsAsRead()
      .then((data) => { })
      //.catch((e) => this.notificationService.errorResp(e));
  }

  private loadNotifications() {
    this.commentService.getCommentNotifications()
      .then((data) => {
        this.notifications = data as Notification[];
      })
      //.catch((e) => this.notificationService.errorResp(e));
  }
}
