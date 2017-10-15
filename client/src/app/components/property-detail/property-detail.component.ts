import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: 'property-detail.component.html',
  styleUrls: ['property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  property: Property;
  slug: string;

  constructor(private route: ActivatedRoute,
              private notification: NotificationService,
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
}
