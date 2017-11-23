import { Property } from './property';
import { Account } from './account';

export class Notification {
  id: number;
  property: Property;
  owner: Account;
  createdAt: Date;
}
