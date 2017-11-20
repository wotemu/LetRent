export class Message {
  id: number;
  chatId: number;
  fromUserId: number;
  messageBody: string;
  isRead: boolean;
  createdAt: Date;
}
