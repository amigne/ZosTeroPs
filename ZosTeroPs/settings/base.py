import os

from django.utils.translation import gettext_lazy as _
from pathlib import Path


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# WSGI
WSGI_APPLICATION = 'ZosTeroPs.wsgi.application'


# URL and routes
ROOT_URLCONF = 'ZosTeroPs.urls'


# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static/'


# Django applications
INSTALLED_APPS = [
    'ztp',
    'logs',
    'user',
    'widget_tweaks',
    'adminlte3',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.humanize',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]


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
    'logs.middleware.ModelChangeLoggingMiddleware',
]


# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates/'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'ztp.context_processors.context',
                'django.template.context_processors.i18n',
            ],
        },
    },
]


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


# Internationalization
USE_I18N = True
USE_L10N = True
USE_TZ = True
LANGUAGES = (
    ('en', _('English')),
    ('fr', _('French')),
)
LANGUAGE_CODE = 'en'
TIME_ZONE = 'UTC'


# ZTP application
ZTP_BASE_URL = 'http://127.0.0.1:8000'
ZTP_BOOTSTRAP_URL = 'bootstrap/'

ZTP_CONFIG_URL = 'config/'

ZTP_FIRMWARES_PATH = 'firmwares/'
ZTP_FIRMWARES_URL = 'firmwares/'


# Version
with open(BASE_DIR / 'VERSION', 'r') as f:
    VERSION = f.read()
