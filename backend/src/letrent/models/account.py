import os.path

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.files.storage import FileSystemStorage
from django.db import models

from ..utils import media_url

# Tutorials:
# https://afropolymath.svbtle.com/authentication-using-django-rest-framework
# https://medium.com/@ramykhuffash/django-authentication-with-just-an-email-and-password-no-username-required-33e47976b517

_property = property
fs = FileSystemStorage()


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
            firstname=kwargs.get('firstname', ""),
            lastname=kwargs.get('lastname', ""),
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password=None, **kwargs):
        account = self.create_user(email, password, **kwargs)

        account.is_admin = True
        account.save()

        return account


class Account(AbstractBaseUser):
    # serializer_class = AccountSerializer
    email = models.EmailField(unique=True)
    firstname = models.CharField(max_length=100, blank=True)
    lastname = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    is_admin = models.BooleanField(default=False)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @_property
    def is_staff(self):
        return self.is_admin

    def avatar_url(self):
        full_path = os.path.join('profile_avatars', '%s.jpg' % self.id)
        if fs.exists(full_path):
            return media_url('profile_avatars/' + ('%s.jpg' % self.id))
        return None

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    def get_short_name(self):
        return '%s %s' % (self.firstname, self.lastname)
