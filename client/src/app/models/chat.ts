import { Property } from './property';
import { Account } from './account';

export class Chat {
  id: number;
  property: Property;
  fromUser: Account;
  toUser: Account;
  createdAt: Date;
}
