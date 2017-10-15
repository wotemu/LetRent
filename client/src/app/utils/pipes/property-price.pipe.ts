import { Pipe } from '@angular/core';
import { Property } from '../../models/property';

@Pipe({
  name: 'propertyPrice'
})
export class PropertyPricePipe {
  transform(property: Property, priceType?: string): string {
    let price;

    switch (priceType) {
      case 'daily': {
        price = property.dailyPrice;
        break;
      }
      case 'weekly': {
        price = property.weeklyPrice;
        break;
      }
      default: {
        if (property.dailyPrice) {
          price = property.dailyPrice;
        } else if (property.weeklyPrice) {
          price = property.weeklyPrice;
        }
        break;
      }
    }
  
    return price > 0 ? `${parseFloat(price).toFixed(2)} €` : 'free';
  }
}
