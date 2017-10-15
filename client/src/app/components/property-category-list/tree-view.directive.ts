import { Component, Input } from '@angular/core';
import { PropertyCategory } from '../../models/property-category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-tree-view',
  templateUrl: './tree-view.html',
  styleUrls: ['./tree-view.css']
})
export class CategoryTreeView {
  private categories: PropertyCategory[];

  @Input()
  set propertyCategories(propertyCategories: PropertyCategory[]) {
    this.categories = propertyCategories;
  }

  constructor(private router: Router) {
  }
}
