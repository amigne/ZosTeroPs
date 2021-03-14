from .base import *

DEBUG = False
SECRET_KEY = 'YOUR_SECRET_KEY'
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]', 'www.YOUR_DOMAIN.COM',
                 'YOUR_DOMAIN.COM', 'YOUR_IP_ADDRESS']


# Databases configuration
# (https://docs.djangoproject.com/en/3.1/ref/databases/)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'YOUR_DB_NAME',
        'USER': 'YOUR_DB_USERNAME',
        'PASSWORD': 'YOUR_DB_PASSWORD',
        'HOST': 'YOUR_DB_SERVER',
        'PORT': '3306',
        'CHARSET': 'utf8mb4'
    }
}


# e-mail sending configuration
# (see https://docs.djangoproject.com/en/3.1/topics/email/)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'YOUR_EMAIL_SERVER'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'YOUR_EMAIL_USER'
EMAIL_HOST_PASSWORD = 'YOUR_EMAIL_PASSWORD'
EMAIL_USE_TLS = False
EMAIL_USE_SSL = False
DEFAULT_FROM_EMAIL= 'YOUR_FROM_EMAIL_ADDRESS'


# Custom logging
# (see https://docs.djangoproject.com/en/3.1/topics/logging/)


# Optional LDAP configuration
# (see https://django-auth-ldap.readthedocs.io/en/latest/)

