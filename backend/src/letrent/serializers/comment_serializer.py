from rest_framework import serializers

from .property_serializer import PropertySerializer
from .account_serializer import AccountSerializer
from ..models import Comment


class CommentSerializer(serializers.ModelSerializer):
    owner = AccountSerializer()
    messageBody = serializers.CharField(source='message_body')
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Comment
        fields = [
            'id',
            'owner',
            'messageBody',
            'createdAt',
        ]
