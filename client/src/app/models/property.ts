import { PropertyImage } from './property-image';

export class Property {
  id: number;
  name: string;
  description: string;
  slug: string;
  address: string;
  active: boolean;
  dailyPrice: number;
  weeklyPrice: number;
  primaryImage: PropertyImage;
  additionalImages: PropertyImage[];
  createdAt: Date;
}
