import json
import re

from django.contrib.sites.requests import RequestSite
from django.conf import settings


def get_domain(request = None):
    """Return the domain of the current request. """
    if request is None:
        # We have no request, we return an empty string
        return ''

    domain_port = get_domain_port(request)
    match = re.match('^([^:]*):?')
    if (match):
        return match.group(1)

    # Should NEVER occur
    return ''


def get_domain_port(request = None):
    """ Return the domain (and port if not the default one) of the current request. """
    if request is None:
        # We have no request, we return an empty string
        return ''

    return RequestSite(request).domain


def get_port(request = None):
    """ Return the TCP port of the current request. """
    if request is None:
        # We have no request, we return an empty string
        return ''

    match = re.match(':([0-9]+)$', get_domain_port(request))
    if match:
        return match.group(1)
    elif get_protocol(request) == 'http':
        return '80'
    return '443'


def get_protocol(request = None):
    """ Return the protocol of the current request. """
    if request is None:
        # We have no request, we return an empty string
        return ''

    return 'https' if request.is_secure() else 'http'


def get_root_url(request = None):
    """ Return the root URL (protocol + domain) of the current request. """
    if request is None:
        # We have no request, so return a slash without any protocol/domain information
        return '/'

    protocol = 'https' if request.is_secure() else 'http'
    domain = RequestSite(request).domain
    return f'{protocol}://{domain}/'


def get_config_base_url(request = None):
    """ Return the config base URL. """
    root_url = get_root_url(request)
    return f'{root_url}{settings.ZTP_CONFIG_URL}'


def get_firwmare_base_url(request = None):
    """ Return the firmware base URL. """
    root_url = get_root_url(request)
    return f'{root_url}{settings.ZTP_FIRMWARES_URL}'


def get_ztp_script_base_url(request = None):
    """ Return the ZTP script base URL. """
    root_url = get_root_url(request)
    return f'{root_url}{settings.ZTP_BOOTSTRAP_URL}'


def parameter_table_to_dict(parameter):
    collection = dict()

    if parameter.data == '':
        # No data: return an empty collection
        return collection

    table_dict = json.loads(parameter.data)

    columns = table_dict['columns'] if 'columns' in table_dict else dict(columns={})
    columns_name = [column['title'] if column['title'] else '' for column in columns]

    if not parameter.name:
        parameter.name = columns_name[0]
    elif columns_name[0] != parameter.name:
        columns_name[0] = parameter.name

    data = table_dict['data'] if 'data' in table_dict else []
    for data_row in data:
        row_dict = dict()
        empty = True
        for index in range(min(len(columns_name), len(data_row))):
            row_dict[columns_name[index]] = data_row[index]
            if index == 0:
                key = data_row[index]
            if data_row[index]:
                empty = False
            index += 1
        if not empty:
            collection[key] = row_dict

    return collection


def preprocess_params(parameters_dict):
    # Import is here in order to prevent importation loop
    from .preprocessor import Preprocessor
    preprocessor = Preprocessor()

    for parameter in parameters_dict.keys():
        parameters_dict[parameter] = preprocessor.process(parameters_dict[parameter])
        x = preprocessor.process(parameters_dict[parameter])

    return parameters_dict
