import { Pipe } from '@angular/core';
import { Property } from '../../models/property';

@Pipe({
  name: 'propertyPrice'
})
export class PropertyPricePipe {
  transform(property: Property, priceType?: string): string {
    let showType = false, type = '';
    let price;

    switch (priceType) {
      case 'daily': {
        price = property.dailyPrice;
        type = 'D';
        break;
      }
      case 'weekly': {
        price = property.weeklyPrice;
        type = 'W';
        break;
      }
      default: {
        showType = true;
        if (property.dailyPrice) {
          price = property.dailyPrice;
          type = 'D';
        } else if (property.weeklyPrice) {
          price = property.weeklyPrice;
          type = 'W';
        }
        break;
      }
    }

    type = showType ? (' / ' + type) : '';
    return price > 0 ? `${parseFloat(price).toFixed(2)} €${type}` : 'free';
  }
}
