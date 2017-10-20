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

    def filter_by_price(self, price_from=None, price_to=None):
        q = self.filter()
        if price_from and price_to:
            q = q.filter(
                Q(daily_price__range=(price_from, price_to))
                | Q(weekly_price__range=(price_from, price_to))
                | Q(weekly_price__range=(price_from * 7, price_to * 7)))
        elif price_from:
            q = q.filter(
                Q(daily_price__gte=price_from)
                | Q(weekly_price__gte=price_from)
                | Q(weekly_price__gte=price_from * 7))
        elif price_to:
            q = q.filter(
                Q(daily_price__lte=price_to)
                | Q(weekly_price__lte=price_to)
                | Q(weekly_price__lte=price_to * 7))
        return q

    def order(self, order_by):
        if order_by == 'location':
            # TODO: TBD..
            raise NotImplemented
        else:
            order_by = '-created_at'
        return self.filter().order_by(order_by)

        # Search by chosen category and its children
        # def search_by_prop_cat_slug(self, property_category_slug):
        #     cat = PropertyCategory.objects.filter(slug=property_category_slug)
        #     all_subcats = PropertyCategory.objects.get_queryset_descendants(queryset=cat, include_self=True)
        #     return self.filter(category__in=all_subcats)

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

    def search(self, query=None, category_ids=[], price_from=None, price_to=None, order_by=None):
        q = self.get_queryset().active()
        if query:
            q = q.search(query)
        if category_ids:
            q = q.filter(category_id__in=category_ids)
        if price_from or price_to:
            q = q.filter_by_price(price_from, price_to)
        q = q.order(order_by)
        return q


class Property(models.Model):
    category = models.ForeignKey(PropertyCategory, on_delete=models.PROTECT)
    owner = models.ForeignKey(Account, on_delete=models.PROTECT)

    name = models.CharField(max_length=150)
    description = models.CharField(max_length=1000)
    address = models.CharField(max_length=150, null=True)
    location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    location_lon = models.DecimalField(max_digits=9, decimal_places=6)
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
