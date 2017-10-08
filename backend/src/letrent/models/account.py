from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# Tutorials:
# https://afropolymath.svbtle.com/authentication-using-django-rest-framework
# https://medium.com/@ramykhuffash/django-authentication-with-just-an-email-and-password-no-username-required-33e47976b517


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        # Ensure that an email address is set
        if not email:
            raise ValueError('Users must have a valid e-mail address')

        # Ensure that a username is set
        # if not kwargs.get('username'):
        #     raise ValueError('Users must have a valid username')

        account = self.model(
            email=self.normalize_email(email),
            # username=kwargs.get('username'),
            firstname=kwargs.get('firstname', None),
            lastname=kwargs.get('lastname', None),
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password=None, **kwargs):
        account = self.create_user(email, password, kwargs)

        account.is_admin = True
        account.save()

        return account


class Account(AbstractBaseUser):
    # serializer_class = AccountSerializer
    # username = models.CharField(unique=True, max_length=50)
    email = models.EmailField(unique=True)

    firstname = models.CharField(max_length=100, blank=True)
    lastname = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    is_admin = models.BooleanField(default=False)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    # REQUIRED_FIELDS = ['username']
