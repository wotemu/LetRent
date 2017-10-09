from rest_framework import serializers

from ..models.property_image import PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    dateAdded = serializers.DateField(source='date_added')
    isPrimary = serializers.BooleanField(source='is_primary')
    url = serializers.ReadOnlyField()

    class Meta:
        model = PropertyImage
        fields = [
            'id',
            'name',
            'url',
            'dateAdded',
            'isPrimary'
        ]
