from django.db import models


class PropertyCategoryQuerySet(models.query.QuerySet):
    def active(self):
        return self.filter(active=True)

    def find_by_id(self, id):
        return self.filter(reporter__pk=id)


class PropertyCategoryManager(models.Manager):
    def get_queryset(self):
        return PropertyCategoryQuerySet(self.model, using=self._db)

    def all(self):
        return self.get_queryset().active()


class PropertyCategory(models.Model):
    name = models.CharField(max_length=150)
    parent_id = models.IntegerField()
    active = models.BooleanField(default=True, null=False)

    objects = PropertyCategoryManager()

    def __str__(self):
        return self.name

    @property
    def title(self):
        return self.name
