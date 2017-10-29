import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public auth: AuthService,
              private notification: NotificationService,
              private router: Router) {
    if (!auth.loggedIn()) {
      this.router.navigate(['']);
      this.notification.error('Please login to see your profile page!');
    }
  }

  ngOnInit() { }

}
