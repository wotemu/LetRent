from rest_framework import serializers

from ..models import Account


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    user_id = serializers.CharField(source='id', required=False)
    username = serializers.CharField(source='email', required=False)

    class Meta:
        model = Account
        fields = (
            'user_id',
            'username',
            'email',
            'firstname',
            'lastname',
            'password',
            'confirm_password',
            'updated_at',
            'created_at'
        )
        read_only_fields = ('updated_at', 'created_at')

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
