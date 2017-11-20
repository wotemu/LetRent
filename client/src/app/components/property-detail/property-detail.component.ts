import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property';
import { NotificationService } from '../../services/notification.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-video-detail',
  templateUrl: 'property-detail.component.html',
  styleUrls: ['property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  property: Property;
  slug: string;
  question = '';
  showLinkToChat = false;
  isOwner = false;

  constructor(private route: ActivatedRoute,
              private notification: NotificationService,
              private location: Location,
              private propertyService: PropertyService) {
  }

  ngOnInit() {
    this.slug = this.route.snapshot.params['slug'];

    this.propertyService.getProperty(this.slug)
        .then((data) => {
          this.property = data as Property;
        })
        .catch((e) => this.notification.errorResp(e));
  }

  onContactRenter(event): void {
    // TODO: Send msg
    console.log(this.question);
  }

  goToChat(event): void {
    // TODO: Redirect user to chat
    event.stopPropagation();
  }

  goBack(): boolean {
    this.location.back();
    return false;
  }
}
