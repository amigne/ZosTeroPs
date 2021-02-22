"""
Django settings for ZosTeroPs project.

Generated by 'django-admin startproject' using Django 3.1.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

import environ
import os

from django.utils.translation import gettext_lazy as _
from pathlib import Path

# Instantiate .env processor and set default values
env = environ.Env(
    DEV=(bool, False),
    DEBUG=(bool, False),
)
environ.Env.read_env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# DEV indicates that the setup is used in an development environment
DEV = env('DEV')

# DEBUG mode should be used for development only
DEBUG = env('DEBUG')

SECRET_KEY = env('SECRET_KEY')

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# ZTP application
ZTP_BASE_URL = 'http://127.0.0.1:8000'
ZTP_BOOTSTRAP_URL = 'bootstrap/'

ZTP_CONFIG_URL = 'config/'

ZTP_FIRMWARES_PATH = 'firmwares/'
ZTP_FIRMWARES_URL = 'firmwares/'

# Internationalization
USE_I18N = True
USE_L10N = True
USE_TZ = True
TIME_ZONE = env('TIME_ZONE', default='UTC')
LANGUAGE_CODE = env('LANGUAGE_CODE', default='en')
LANGUAGES = (
    ('en', _('English')),
    ('fr', _('French')),
)

# Authentications and logons
LOGIN_URL = 'user:login'
LOGOUT_URL = 'user:logout'
LOGIN_REDIRECT_URL = 'home'
LOGOUT_REDIRECT_URL = 'home'

AUTH_USER_MODEL = 'user.User'
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

LDAP_AUTHENTICATION = env.bool('LDAP_AUTHENTICATION', False)
if LDAP_AUTHENTICATION:
    import ldap
    from django_auth_ldap.config import LDAPSearch, GroupOfNamesType

    AUTHENTICATION_BACKENDS = env.tuple('AUTHENTICATION_BACKENDS',
                                        default=('django_auth_ldap.backend.LDAPBackend', 'django.contrib.auth.backends.ModelBackend',))
    AUTH_LDAP_SERVER_URI = env('AUTH_LDAP_SERVER_URI', default='ldap://localhost')
    AUTH_LDAP_BIND_DN = env('AUTH_LDAP_BIND_DN', default='cn=admin,dc=example,dc=com')
    AUTH_LDAP_BIND_PASSWORD = env('AUTH_LDAP_BIND_PASSWORD', default='admin')

    AUTH_LDAP_USER_DN_TEMPLATE = env('AUTH_LDAP_USER_DN_TEMPLATE', default='uid=%(user)s,ou=Users,dc=example,dc=com')

    AUTH_LDAP_USER_ATTR_MAP = env.dict('AUTH_LDAP_USER_ATTR_MAP', default={
        'first_name': 'givenName',
        'last_name': 'sn',
        'email': 'mail',
    })

    AUTH_LDAP_REQUIRE_GROUP = env('AUTH_LDAP_REQUIRE_GROUP', default='cn=zosterops,ou=Groups,dc=example,dc=com')
    AUTH_LDAP_DENY_GROUP = env('AUTH_LDAP_DENY_GROUP', default='cn=zosterops-disabled,ou=Groups,dc=example,dc=com')

    AUTH_LDAP_USER_FLAGS_BY_GROUP = {}
    AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_ACTIVE = env('AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_ACTIVE',
                                                  default='cn=zosterops,ou=Groups,dc=example,dc=com')
    AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_STAFF = env('AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_STAFF',
                                                 default='cn=zosterops-staff,ou=Groups,dc=example,dc=com')
    AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_SUPERUSER = env('AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_SUPERUSER',
                                                     default='cn=zosterops-superuser,ou=Groups,dc=example,dc=com')
    if AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_ACTIVE:
        AUTH_LDAP_USER_FLAGS_BY_GROUP['is_active'] = AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_ACTIVE
    if AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_STAFF:
        AUTH_LDAP_USER_FLAGS_BY_GROUP['is_staff'] = AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_STAFF
    if AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_SUPERUSER:
        AUTH_LDAP_USER_FLAGS_BY_GROUP['is_superuser'] = AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_SUPERUSER

    AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_ACTIVE = 'cn=zosterops,ou=Groups,dc=example,dc=com'
    AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_STAFF = 'cn=zosterops-staff,ou=Groups,dc=example,dc=com'
    AUTH_LDAP_USER_FLAGS_BY_GROUP_IS_SUPERUSER = 'cn=zosterops-superuser,ou=Groups,dc=example,dc=com'

    AUTH_LDAP_GROUP_TYPE = GroupOfNamesType(
        name_attr=env('AUTH_LDAP_GROUP_TYPE_NAME_ATTR', default='cn'))

    AUTH_LDAP_GROUP_SEARCH = LDAPSearch(
        env('AUTH_LDAP_GROUP_SEARCH_BASE_DN', default='ou=Groups,dc=example,dc=com'),
        ldap.SCOPE_SUBTREE,
        env('AUTH_LDAP_GROUP_SEARCH_FILTER_STR', default='(objectClass=groupOfNames)'),
    )

    AUTH_LDAP_MIRROR_GROUPS = env.tuple('AUTH_LDAP_MIRROR_GROUPS',
                                        default=('Administrators', 'Operators', 'Readers', 'Observers',))

    AUTH_LDAP_ALWAYS_UPDATE_USER = env.bool('AUTH_LDAP_ALWAYS_UPDATE_USER', default=True)

    AUTH_LDAP_FIND_GROUP_PERMS = env.bool('AUTH_LDAP_FIND_GROUP_PERMS', default=True)

    AUTH_LDAP_CACHE_TIMEOUT = env.int('AUTH_LDAP_CACHE_TIMEOUT', default=0)

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

# Databases
DATABASES = {
    'default': env.db(),
}

# URL and routes
ROOT_URLCONF = 'ZosTeroPs.urls'

# WSGI
WSGI_APPLICATION = 'ZosTeroPs.wsgi.application'

# Django applications
INSTALLED_APPS = [
    'ztp',
    'user',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.humanize',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
if DEV:
    INSTALLED_APPS += [
        'rosetta',
    ]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "loggers": {"django_auth_ldap": {"level": "DEBUG", "handlers": ["console"]}},
}

# Middlewares
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# E-mails
EMAIL_BACKEND = env(
    'EMAIL_BACKEND',
    default=(
        'django.core.mail.backends.console.EmailBackend' if DEV else 'django.core.mail.backends.smtp.EmailBackend'))
EMAIL_HOST = env('EMAIL_HOST', default='localhost')
EMAIL_PORT = env.int('EMAIL_PORT', default=25)
EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=False)
EMAIL_USE_SSL = env.bool('EMAIL_USE_SSL', default=False)
DEFAULT_FROM_EMAIL= env('DEFAULT_FROM_EMAIL', default='webmaster@localhost')
