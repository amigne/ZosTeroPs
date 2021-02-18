from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    User model duplicated from the Django authentication system:
    This model has no customized fields or behavior, but keeps
    intact the possibility to add them later.

    Username and password are required. Other fields are optional.
    """
    class Meta(AbstractUser.Meta):
        swappable = 'AUTH_USER_MODEL'
