import { Component, OnInit, OnDestroy } from '@angular/core';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property.service';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from '../../helpers/app-setting';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit, OnDestroy {
  title = 'Properties';
  properties: Property[];
  noRecordsFound = false;
  minPrice = 0;
  maxPrice = 100;
  priceFrom;
  priceTo;

  itemsPerPage = AppSetting.ITEMS_PER_PAGE;
  currentPage = 1;
  totalItems = 0;

  private routerListener: any;
  private previousPriceFrom: number;
  private previousPriceTo: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private propertyService: PropertyService,
              private notification: NotificationService) {
  }

  ngOnInit() {
    this.routerListener = this.route.queryParams.subscribe((params: any) => {
      const filterParams = {};
      if (params['categoryIds']) {
        filterParams['categoryIds'] = params['categoryIds'].split(',');
      }
      if (params['priceFrom']) {
        filterParams['priceFrom'] = params['priceFrom'];
        this.priceFrom = params['priceFrom'];
      }
      if (params['priceTo']) {
        filterParams['priceTo'] = params['priceTo'];
        this.priceTo = params['priceTo'];
      }
      if (params['page']) {
        filterParams['page'] = params['page'];
        this.currentPage = +params['page'];
      }
      this.reloadProperties(filterParams);
    });
  }

  ngOnDestroy() {
    this.routerListener.unsubscribe();
  }

  private reloadProperties(filterParams = {}) {
    this.propertyService.getProperties(filterParams)
        .then((data) => {
          this.properties = data.results as Property[];
          this.noRecordsFound = !(data.results.length > 0);
          this.totalItems = data.count;
        })
        .catch((e) => this.notification.errorResp(e));
  }

  onPriceFilterFinish(event) {
    const priceFrom = event.from;
    const priceTo = event.to;

    if (this.previousPriceFrom !== priceFrom || this.previousPriceTo !== priceTo) {
      this.previousPriceFrom = priceFrom;
      this.previousPriceTo = priceTo;

      const filterParams = this.getCurrentFilterParams();
      filterParams['priceFrom'] = priceFrom;
      filterParams['priceTo'] = priceTo;

      if (this.minPrice === priceFrom) {
        delete filterParams['priceFrom'];
      }
      if (this.maxPrice === priceTo) {
        delete filterParams['priceTo'];
      }
      // Also reset current page number
      delete filterParams['page'];
      this.currentPage = 1;

      this.router.navigate(['/properties'], {queryParams: filterParams});
    }
    console.log('Price filter was changed');
  }

  onFilter() {
  }

  onResetFilter() {
    const routeParams: any = {};
    const params = this.getCurrentFilterParams();
    if (params['categoryIds']) {
      routeParams.categoryIds = params['categoryIds'];
    }
    this.router.navigate(['/properties'], {queryParams: routeParams});
    return false;
  }

  onPaginationClick(event: any) {
    if (event.page === 1) {
      const params = this.getCurrentFilterParams();
      delete params['page'];
      return this.router.navigate(['/properties'], {queryParams: params});
    }
    this.router.navigate(['/properties'], {queryParams: {page: event.page}, queryParamsHandling: 'merge'});
  }

  getCurrentFilterParams() {
    const paramsObj = this.route.snapshot.queryParams;
    const params = {};
    Object.keys(paramsObj).forEach((key) => {
      params[key] = paramsObj[key];
    });
    return params;
  }
}
