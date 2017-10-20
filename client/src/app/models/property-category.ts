export class PropertyCategory {
  id: number;
  name: string;
  fullSlug: string;
  children: PropertyCategory[];
  level: number;
  faIconName: string;
}
