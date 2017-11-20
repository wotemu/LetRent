import { Pipe, NgModule } from '@angular/core';
import { PropertyImage } from '../../models/property-image';
import { AppSetting } from '../../helpers/app-setting';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe {
  constructor(private datePipe: DatePipe) {
  }

  transform(inputDateStr: string, args: string[]): string {
    const current = new Date().valueOf(),
        inputDate = Date.parse(inputDateStr),
        input = inputDate.valueOf(),
        msPerMinute = 60 * 1000,
        msPerHour = msPerMinute * 60,
        msPerDay = msPerHour * 24,
        msPerMonth = msPerDay * 30,
        msPerYear = msPerDay * 365;

    const elapsed = current - input;

    if (elapsed < msPerDay) {
      return 'Today at ' + this.datePipe.transform(inputDate, 'HH:mm');
    }
    return this.datePipe.transform(inputDate, 'dd/MM/yyyy HH:mm');

    // if (elapsed < msPerMinute) {
    //   return Math.round(elapsed / 1000) + ' seconds ago';
    // } else if (elapsed < msPerHour) {
    //   return Math.round(elapsed / msPerMinute) + ' minutes ago at ' + this.datePipe.transform(inputDate, 'H:i');
    // } else if (elapsed < msPerDay) {
    //   return Math.round(elapsed / msPerHour) + ' hours ago';
    // } else if (elapsed < msPerMonth) {
    //   return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
    // } else if (elapsed < msPerYear) {
    //   return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
    // } else {
    //   console.log('inside the if condition', elapsed);
    //   return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
    // }
  }
}
