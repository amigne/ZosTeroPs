from django.contrib.sites.requests import RequestSite
from django.conf import settings


def get_root_url(request):
    """ Return the root URL (protocol + domain) of the current request. """
    protocol = 'https' if request.is_secure() else 'http'
    domain = RequestSite(request).domain

    return f"{protocol}://{domain}/"


def get_config_base_url(request):
    """ Return the config base URL. """
    root_url = get_root_url(request)
    return f'{root_url}{settings.ZTP_CONFIG_URL}'


def get_firwmare_base_url(request):
    """ Return the firmware base URL. """
    root_url = get_root_url(request)
    return f'{root_url}{settings.ZTP_FIRMWARES_URL}'

def get_ztp_script_base_url(request):
    """ Return the ZTP script base URL. """
    root_url = get_root_url(request)
    return f'{root_url}{settings.ZTP_BOOTSTRAP_URL}'