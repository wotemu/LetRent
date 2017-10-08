import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property';

@Component({
  selector: 'app-video-detail',
  templateUrl: 'property-detail.component.html',
  styleUrls: ['property-detail.component.css']
})
export class PropertyDetailComponent {
  property: Property;
  slug: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private propertyService: PropertyService) {
  }
}
