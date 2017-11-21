from django.db import models

from .account import Account
from .chat import Chat


class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages')
    from_user = models.ForeignKey(Account, related_name='messages')
    message_body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


def create_message(chat_id, from_user_id, message_body, is_read=False):
    message = Message(chat_id=chat_id, from_user_id=from_user_id, message_body=message_body, is_read=is_read)
    message.save()
    return message
