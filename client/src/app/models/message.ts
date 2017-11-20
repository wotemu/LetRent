import { Account } from './account';

export class Message {
  id: number;
  chatId: number;
  fromUser: Account;
  messageBody: string;
  createdAt: Date;
}
