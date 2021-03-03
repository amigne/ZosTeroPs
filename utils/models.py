from django.contrib.auth import get_user_model
from django.db import models


User = get_user_model()


class DateUserBaseModel(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User,
                             null=True,
                             on_delete=models.SET_NULL)

    class Meta:
        abstract = True
