from django.db import models

from ..models import Property


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')

    name = models.CharField(max_length=150)
    image = models.ImageField(upload_to='images/properties/', null=True, blank=True)
    is_primary = models.BooleanField(default=True, null=False)
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):  # __unicode__
        return "ID: " + self.pk + ", Name" + self.name

    def get_image(self, obj):
        return str(obj.image.url)
