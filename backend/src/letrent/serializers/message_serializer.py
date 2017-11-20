from rest_framework import serializers

from ..models import Message


class MessageSerializer(serializers.ModelSerializer):
    chatId = serializers.IntegerField(source='chat_id')
    fromUserId = serializers.IntegerField(source='from_user_id')
    messageBody = serializers.CharField(source='message_body')
    isRead = serializers.BooleanField(source='is_read')
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Message
        fields = [
            'id',
            'chatId',
            'fromUserId',
            'messageBody',
            'isRead',
            'createdAt',
        ]
