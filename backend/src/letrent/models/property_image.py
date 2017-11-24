from django.contrib.staticfiles.templatetags.staticfiles import static
from django.db import models

from ..models import Property
from ..utils import no_property_img_url, media_url

# On the module-level, do a workaround reference
# as property() is just a normal built-in function
_property = property


class PropertyImage(models.Model):
    def upload_path(self, filename):
        if not self.pk:
            return "properties/not_defined/"
        # i = PropertyImage.objects.create()
        # self.id = self.pk = i.id
        return "properties/%s/" % str(self.id)

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images', unique=False)

    file_path = models.CharField(max_length=150)
    image = models.ImageField(upload_to=upload_path, null=True, blank=True)
    is_primary = models.BooleanField(default=True, null=False)
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):  # __unicode__
        return "ID: %i, Name: %s" % (self.pk, self.file_path)

    # @_property
    def url(self):
        return media_url(self.file_path)
