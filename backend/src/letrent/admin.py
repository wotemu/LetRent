from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from .models import Property, PropertyCategory

admin.site.register(Property)
admin.site.register(PropertyCategory, MPTTModelAdmin)
