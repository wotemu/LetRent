from rest_framework import serializers

from .account_serializer import AccountSerializer
from ..models import Property
from ..serializers import PropertyImageSerializer


class PropertySerializer(serializers.ModelSerializer):
    primaryImage = PropertyImageSerializer(source='primary_image')
    dailyPrice = serializers.DecimalField(source='daily_price', max_digits=10, decimal_places=2)
    weeklyPrice = serializers.DecimalField(source='weekly_price', max_digits=10, decimal_places=2)
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Property
        fields = [
            'id',
            'name',
            'description',
            'slug',
            'address',
            'dailyPrice',
            'weeklyPrice',
            'active',
            'primaryImage',
            'createdAt'
        ]


class PropertyDetailSerializer(serializers.ModelSerializer):
    owner = AccountSerializer()
    primaryImage = PropertyImageSerializer(source='primary_image')
    additionalImages = PropertyImageSerializer(source='additional_images', many=True)
    dailyPrice = serializers.DecimalField(source='daily_price', max_digits=10, decimal_places=2)
    weeklyPrice = serializers.DecimalField(source='weekly_price', max_digits=10, decimal_places=2)
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Property
        fields = [
            'id',
            'owner',
            'name',
            'description',
            'slug',
            'address',
            'dailyPrice',
            'weeklyPrice',
            'active',
            'createdAt',
            'additionalImages',
            'primaryImage'
        ]
