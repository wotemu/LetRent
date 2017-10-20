import { Component, Input, OnInit } from '@angular/core';
import { PropertyCategory } from '../../models/property-category';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-tree-view',
  templateUrl: './tree-view.html',
  styleUrls: ['./tree-view.css']
})
export class CategoryTreeView implements OnInit {
  activeCategories = {};

  private categories: PropertyCategory[];

  @Input()
  set propertyCategories(propertyCategories: PropertyCategory[]) {
    this.categories = propertyCategories;
  }

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    // Parse previously selected category IDs from URL params
    const categoryIdsAsString = this.route.snapshot.queryParams['categoryIds'];
    const categoryIds = categoryIdsAsString ? categoryIdsAsString.split(',') : [];
    categoryIds.forEach((catId) => this.activeCategories[catId] = true);
  }

  onCategoryClick(event, categoryId) {
    const itemHasActiveClass = event.target.classList.contains('active');
    if (itemHasActiveClass) {
      event.target.classList.remove('active');

      // If category ID is already in the list, remove it
      delete this.activeCategories[categoryId];
    } else {
      event.target.classList.add('active');
      this.activeCategories[categoryId] = true;
    }

    const routeParams: any = {};
    const activeCategoryIds = Object.keys(this.activeCategories);
    if (activeCategoryIds.length) {
      routeParams.categoryIds = activeCategoryIds.join(',');
    }

    this.router.navigate(['/properties'], {queryParams: routeParams});
    return false;
  }
}
