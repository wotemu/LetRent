from rest_framework import serializers

from .account_serializer import AccountSerializer
from ..models import Chat


class ChatSerializer(serializers.ModelSerializer):
    fromUser = AccountSerializer(source='from_user')
    toUser = AccountSerializer(source='to_user')
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Chat
        fields = [
            'id',
            'fromUser',
            'toUser',
            'createdAt',
        ]
