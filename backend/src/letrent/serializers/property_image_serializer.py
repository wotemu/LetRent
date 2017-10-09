from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework import serializers

from ..models.property_image import PropertyImage

no_property_img_url = static("ang/assets/images/no_image.gif")


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = [
            'id',
            'name',
            'image',
            'date_added',
            'is_primary'
        ]
