import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: 'stars.directive.html',
  styleUrls: ['stars.directive.css']
})
export class StarsDirective {
  max = 5;
  range;

  @Input() rating: number;

  constructor() {
    this.range = [];
    for (let i = 1; i <= this.max; i++) {
      this.range.push(i);
    }
  }
}
