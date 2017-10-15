import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent implements OnInit, OnDestroy {
  query: string;
  properties: Property[];
  noRecordsFound = false;

  private routeListener: any;
  private requestListener: any;

  constructor(private route: ActivatedRoute,
              private propertyService: PropertyService) {
  }

  ngOnInit() {
    this.routeListener = this.route.params.subscribe((params) => {
      this.query = params['q'];
      this.requestListener = this.propertyService.search(this.query).subscribe((data) => {
        this.properties = data as Property[];
        this.noRecordsFound = !(data.length > 0);
      });
    });
  }

  ngOnDestroy() {
    this.routeListener.unsubscribe();
    this.requestListener.unsubscribe();
  }
}
