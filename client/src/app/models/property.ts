import { PropertyImage } from './property-image';

export class Property {
  id: number;
  name: string;
  description: string;
  slug: string;
  address: string;
  image: string;
  active: boolean;
  images: PropertyImage[];
  created_at: Date;
}
