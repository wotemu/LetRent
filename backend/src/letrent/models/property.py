from django.db import models
from django.db.models import Q
from django.db.models.signals import pre_save

from .account import Account
from .property_category import PropertyCategory
from ..utils import unique_slug_generator

# On the module-level, do a workaround reference
# as property() is just a normal built-in function
_property = property


class PropertyQuerySet(models.query.QuerySet):
    def active(self):
        return self.filter(active=True)

    def search(self, query):
        return self.filter(Q(name__icontains=query) | Q(slug__icontains=query))

    # Search by chosen category and its children
    def search_by_prop_cat_slug(self, property_category_slug):
        cat = PropertyCategory.objects.filter(slug=property_category_slug)
        all_subcats = PropertyCategory.objects.get_queryset_descendants(queryset=cat, include_self=True)
        return self.filter(category__in=all_subcats)

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

    def search(self, query=None, property_category_slug=None):
        q = self.get_queryset().active()
        if query:
            q = q.search(query)
        if property_category_slug:
            q = q.search_by_prop_cat_slug(property_category_slug)
        return q


class Property(models.Model):
    category = models.ForeignKey(PropertyCategory, on_delete=models.PROTECT)
    owner = models.ForeignKey(Account, on_delete=models.PROTECT)

    name = models.CharField(max_length=150)
    description = models.CharField(max_length=1000)
    address = models.CharField(max_length=150, null=True)
    daily_price = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
    weekly_price = models.DecimalField(max_digits=10, decimal_places=2, default=None, blank=True, null=True)
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
