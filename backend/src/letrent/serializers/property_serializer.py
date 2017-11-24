from rest_framework import serializers

from .account_serializer import AccountSerializer
from ..models import Property
from ..serializers import PropertyImageSerializer


class PropertySerializer(serializers.ModelSerializer):
    ownerId = serializers.IntegerField(source='owner_id')
    primaryImage = PropertyImageSerializer(source='primary_image')
    dailyPrice = serializers.DecimalField(source='daily_price', max_digits=10, decimal_places=5)
    weeklyPrice = serializers.DecimalField(source='weekly_price', max_digits=10, decimal_places=5)
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Property
        fields = [
            'id',
            'ownerId',
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
    categoryId = serializers.IntegerField(source='category_id')
    owner = AccountSerializer()
    primaryImage = PropertyImageSerializer(source='primary_image')
    additionalImages = PropertyImageSerializer(source='additional_images', many=True, required=False)
    dailyPrice = serializers.DecimalField(source='daily_price', max_digits=10, decimal_places=5)
    weeklyPrice = serializers.DecimalField(source='weekly_price', max_digits=10, decimal_places=5)
    locationLatitude = serializers.DecimalField(source='location_lat', max_digits=20, decimal_places=16)
    locationLongitude = serializers.DecimalField(source='location_lon', max_digits=20, decimal_places=16)
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Property
        fields = [
            'id',
            'categoryId',
            'owner',
            'name',
            'description',
            'slug',
            'address',
            'locationLatitude',
            'locationLongitude',
            'dailyPrice',
            'weeklyPrice',
            'active',
            'createdAt',
            'additionalImages',
            'primaryImage'
        ]


class PropertyModificationSerializer(serializers.ModelSerializer):
    # primaryImage = PropertyImageSerializer(source='primary_image', required=False) # TODO! Make this true, after upload image feature
    # additionalImages = PropertyImageSerializer(source='additional_images', many=True, required=False)
    dailyPrice = serializers.DecimalField(source='daily_price', max_digits=10, decimal_places=5)
    weeklyPrice = serializers.DecimalField(source='weekly_price', max_digits=10, decimal_places=5)
    locationLatitude = serializers.DecimalField(source='location_lat', max_digits=20, decimal_places=16)
    locationLongitude = serializers.DecimalField(source='location_lon', max_digits=20, decimal_places=16)

    class Meta:
        model = Property
        fields = [
            'id',
            'name',
            'description',
            'address',
            'locationLatitude',
            'locationLongitude',
            'dailyPrice',
            'weeklyPrice',
            # 'additionalImages',
            # 'primaryImage'
        ]