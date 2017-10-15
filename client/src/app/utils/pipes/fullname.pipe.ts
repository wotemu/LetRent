import { Pipe } from '@angular/core';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe {
  transform(instance: any, args: string[]): string {
    if (instance.firstname && instance.lastname) {
      return `${instance.firstname} ${instance.lastname}`;
    } else if (instance.firstname) {
      return instance.firstname;
    } else if (instance.lastname) {
      return instance.lastname;
    }
    return '';
  }
}
