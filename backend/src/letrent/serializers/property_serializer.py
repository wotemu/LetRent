from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework import serializers

from ..models import Property


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
        return static("ang/assets/images/no-image.jpg")


class PropertyDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

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
        return static("ang/assets/images/no-image.jpg")
