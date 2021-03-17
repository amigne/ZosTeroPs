from .base import *

DEBUG = True
SECRET_KEY = '&&tnr)l9nhz@)3mgwo)p1ewsbdw1vx*7p0=@46c-ojp(d=fhe7'
ALLOWED_HOSTS = ['*']


# Don't force HTTPS sessions to GUI
# (Not recommended for production!)
GUI_SSL_REDIRECT = False


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': [BASE_DIR / 'db.sqlite3'],
    }
}


EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL= 'webmaster@zosterops.test'


INSTALLED_APPS += [
    'rosetta',
]
