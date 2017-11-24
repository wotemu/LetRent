import { PropertyImage } from './property-image';
import { Account } from './account';

export class Property {
  id: number;
  owner: Account;
  name: string;
  description: string;
  slug: string;
  address: string;
  locationLatitude: number;
  locationLongitude: number;
  active: boolean;
  dailyPrice: number;
  weeklyPrice: number;
  categoryId: number;
  primaryImage: PropertyImage;
  //additionalImages: PropertyImage[];
  //createdAt: Date;
}
