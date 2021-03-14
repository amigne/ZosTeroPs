"""
WSGI config for ZosTeroPs project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application


def set_environment():
    """ Determine the right settings file to be used. """

    # Choosing environment
    RUNNING_ENV = os.environ.get('RUNNING_ENV', default='dev')

    if RUNNING_ENV == 'prod':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ZosTeroPs.settings.prod')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ZosTeroPs.settings.dev')

    # Return
    return RUNNING_ENV


# Set environment
set_environment()


application = get_wsgi_application()
