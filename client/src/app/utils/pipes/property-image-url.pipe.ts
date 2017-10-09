import { Pipe } from '@angular/core';
import { PropertyImage } from '../../models/property-image';
import { AppSetting } from '../../helpers/app-setting';

@Pipe({
  name: 'propertyImageUrl'
})
export class PropertyImageUrlPipe {
  transform(propertyImage: PropertyImage, args: string[]): string {
    if (propertyImage) {
      return propertyImage.url;
    }
    return AppSetting.NO_IMAGE_URL;
  }
}
