from rest_framework import serializers

from .property_serializer import PropertySerializer
from .account_serializer import AccountSerializer
from ..models import Chat


class ChatSerializer(serializers.ModelSerializer):
    property = PropertySerializer(many=False)
    fromUser = AccountSerializer(source='from_user')
    toUser = AccountSerializer(source='to_user')
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Chat
        fields = [
            'id',
            'property',
            'fromUser',
            'toUser',
            'createdAt',
        ]
