from django.db import models
from django.db.models import Q

from .account import Account
from .property import Property


class Chat(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    from_user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='from_user')
    to_user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='to_user')
    created_at = models.DateTimeField(auto_now_add=True)
