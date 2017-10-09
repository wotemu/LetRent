from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework import serializers

from ..models import Property
from ..serializers import PropertyImageSerializer

no_property_img_url = static("ang/assets/images/no_image.gif")


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id',
            'name',
            'description',
            'slug',
            'address',
            'image',
            'active',
            'created_at'
        ]

    def get_image(self, obj):
        if obj.image:
            return str(obj.image.url)
        return no_property_img_url


class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True)

    class Meta:
        model = Property
        fields = [
            'id',
            'name',
            'description',
            'slug',
            'address',
            'active',
            'created_at',
            'images'
        ]
