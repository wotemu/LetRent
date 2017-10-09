from django.contrib.staticfiles.templatetags.staticfiles import static
from django.db import models

from ..models import Property
from ..utils import no_property_img_url

# On the module-level, do a workaround reference
# as property() is just a normal built-in function
_property = property


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')

    name = models.CharField(max_length=150)
    image = models.ImageField(upload_to='images/properties/', null=True, blank=True)
    is_primary = models.BooleanField(default=True, null=False)
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):  # __unicode__
        return "ID: %i, Name: %s" % (self.pk, self.name)

    @_property
    def url(self):
        if self.image:
            img_path = 'images/property/%s/%s/' % (self.property.pk, self.image)
            return static(img_path)
        return no_property_img_url
