import { PropertyImage } from './property-image';

export class Property {
  id: number;
  name: string;
  description: string;
  slug: string;
  address: string;
  active: boolean;
  primaryImage: PropertyImage;
  additionalImages: PropertyImage[];
  created_at: Date;
}
