from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework import serializers

from ..models import Video
from ..models import Property
from ..models import Account


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
            'date_created'
        ]

    def get_image(self, obj):
        if obj.image:
            return str(obj.image.url)
        return static("ang/assets/images/no-image.jpg")


class PropertyDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id',
            'name',
            'description',
            'slug',
            'address',
            'image',
            'active',
            'date_created'
        ]

    def get_image(self, obj):
        if obj.image:
            return str(obj.image.url)
        return static("ang/assets/images/no-image.jpg")


class VideoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = ['name', 'slug', 'embed', 'featured', 'image']

    def get_image(self, obj):
        if obj.image2:
            return str(obj.image2.url)
        return static("ang/assets/images/nature/1.jpg")


class VideoDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    is_promo = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'name',
            'slug',
            'embed',
            'featured',
            'image',
            'is_promo',
        ]

    def get_image(self, obj):
        if obj.image2:
            return str(obj.image2.url)
        return static("ang/assets/images/nature/1.jpg")

    def get_is_promo(self, obj):
        return False


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Account
        fields = (
            'id',
            'email',
            'firstname',
            'lastname',
            'password',
            'confirm_password',
            'date_created',
            'date_modified'
        )
        read_only_fields = ('date_created', 'date_modified')

    def create(self, validated_data):
        return Account.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.firstname = validated_data.get('firstname', instance.firstname)
        instance.lastname = validated_data.get('lastname', instance.lastname)

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and password == confirm_password:
            instance.set_password(password)

        instance.save()
        return instance

    def validate(self, data):
        # Ensure the passwords are the same
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                "The passwords have to be the same"
            )
        return data
