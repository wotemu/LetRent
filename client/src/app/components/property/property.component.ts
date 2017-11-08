import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  constructor(private router: Router,
              public auth: AuthService,
              private notification: NotificationService) {
    if (!auth.loggedIn()) {
      this.router.navigate(['/']);
      this.notification.error('Please login to see your profile page!');
  }}

  ngOnInit() { }

}
