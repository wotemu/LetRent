from django.db import models
from django.db.models.signals import pre_save
from mptt.models import MPTTModel, TreeForeignKey

from ..utils import unique_slug_generator


class PropertyCategory(MPTTModel):
    name = models.CharField(max_length=100, unique=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)
    slug = models.SlugField(default="", blank=True, null=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    class Meta:
        unique_together = (('parent', 'slug',))
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name

    @property
    def title(self):
        return self.name


def property_category_pre_save_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance)


pre_save.connect(property_category_pre_save_receiver, sender=PropertyCategory)
