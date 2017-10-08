from django.db import models
from django.db.models import Q
from django.db.models.signals import pre_save
from ..utils import unique_slug_generator
from datetime import datetime


class PropertyQuerySet(models.query.QuerySet):
    def active(self):
        return self.filter(active=True)

    def search(self, query):
        return self.filter(Q(name__icontains=query) | Q(slug__icontains=query))


class PropertyManager(models.Manager):
    def get_queryset(self):
        return PropertyQuerySet(self.model, using=self._db)

    def all(self):
        return self.get_queryset().active()

    def search(self, query):
        return self.get_queryset().search(query).active()


class Property(models.Model):
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=1000)
    address = models.CharField(max_length=150, null=True)
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to='images/properties/', null=True, blank=True)
    active = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True, default=datetime.now())
    created_at = models.DateTimeField(auto_now_add=True, default=datetime.now())

    objects = PropertyManager()

    def __str__(self):  # __unicode__
        return self.name

    @property
    def title(self):
        return self.name


def property_pre_save_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance)


pre_save.connect(property_pre_save_receiver, sender=Property)
