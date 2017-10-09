from rest_framework import serializers

from ..models import Property
from ..serializers import PropertyImageSerializer


class PropertySerializer(serializers.ModelSerializer):
    primaryImage = PropertyImageSerializer(source='primary_image')
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Property
        fields = [
            'id',
            'name',
            'description',
            'slug',
            'address',
            'active',
            'primaryImage',
            'createdAt'
        ]


class PropertyDetailSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at')
    primaryImage = PropertyImageSerializer(source='primary_image')
    additionalImages = PropertyImageSerializer(source='additional_images', many=True)

    class Meta:
        model = Property
        fields = [
            'id',
            'name',
            'description',
            'slug',
            'address',
            'active',
            'createdAt',
            'additionalImages',
            'primaryImage'
        ]
