import { Component, OnInit } from '@angular/core';
import { PropertyCategoryService } from '../../services/property-category.service';
import { PropertyCategory } from '../../models/property-category';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-property-category-list',
  templateUrl: 'property-category-list.component.html',
  styleUrls: ['property-category-list.component.css']
})
export class PropertyCategoryListComponent implements OnInit {
  public propertyCategories: PropertyCategory[];

  constructor(private propertyCategoryService: PropertyCategoryService,
              private notification: NotificationService) {
  }

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.propertyCategoryService.getPropertyCategories()
        .then((data) => {
          this.propertyCategories = data as PropertyCategory[];
        })
        .catch((e) => this.notification.errorResp(e));
  }
}
