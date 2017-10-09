from django.db import models
from django.db.models import Q
from django.db.models.signals import pre_save

from ..utils import unique_slug_generator

# On the module-level, do a workaround reference
# as property() is just a normal built-in function
_property = property


class PropertyQuerySet(models.query.QuerySet):
    def active(self):
        return self.filter(active=True)

    def search(self, query):
        return self.filter(Q(name__icontains=query) | Q(slug__icontains=query))

    # def primary_image(self):
    #     return self.filter(property_image__is_primary=True)
    #
    # def additional_images(self):
    #     return self.filter(property_image__is_primary=False)


class PropertyManager(models.Manager):
    def get_queryset(self):
        return PropertyQuerySet(self.model, using=self._db)

    def all(self):
        return self.get_queryset().active()

    def all_with_images(self):
        return self.get_queryset().active()

    def search(self, query):
        return self.get_queryset().search(query).active()


class Property(models.Model):
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=1000)
    address = models.CharField(max_length=150, null=True)
    slug = models.SlugField(unique=True, blank=True)
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    objects = PropertyManager()

    def __str__(self):  # __unicode__
        return self.name

    @_property
    def title(self):
        return self.name

    @_property
    def primary_image(self):
        res = (self.images.filter(is_primary=True).first())
        return res

    @_property
    def additional_images(self):
        res = self.images.filter(is_primary=False)
        return res


def property_pre_save_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance)


pre_save.connect(property_pre_save_receiver, sender=Property)
