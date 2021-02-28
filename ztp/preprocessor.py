import re

from django.conf import settings

from .models import Config, Firmware, ZtpScript
from .utils import (get_config_base_url, get_domain, get_firwmare_base_url,
                    get_port, get_protocol, get_root_url,
                    get_ztp_script_base_url)


class Preprocessor:
    START_TAG = '@@'
    END_TAG = '@@'
    SPLITTING_RE = '(?s)(' + START_TAG + '.*?' + END_TAG + ')'
    request = None

    def __init__(self, request=None):
        """ Constructor permits to pass a request to the class. """
        if request is not None:
            Preprocessor.request = request

    def process(self, input_text):
        # Split the input text into a list of tokens
        tokens = re.split(Preprocessor.SPLITTING_RE, input_text)

        result = ''
        for token in tokens:
            if not token.startswith(Preprocessor.START_TAG):
                # Literal, don't process
                result += token
                continue

            expression = token[len(Preprocessor.START_TAG):-len(Preprocessor.END_TAG)].strip()
            match = re.match(r"^([A-Za-z0-9_]+)([\s.\[\]].*)?", expression)
            if not match:
                # Invalid preprocessor expression. We silently copy the token
                result += token
                continue

            keyword = match.group(1)

            processed = self._process_keyword(keyword, expression)
            if processed is None:
                # Non-existent keyword or invalid syntax. We silently copy the token
                result += token
                continue

            result += processed

        return result

    def _process_keyword(self, keyword, expression):
        _process_keyword_function = '_process_' + keyword
        if hasattr(self, _process_keyword_function) and callable(getattr(self, _process_keyword_function)):
            return getattr(self, _process_keyword_function)(expression)

        # Unknown keyword, return None
        return None

    def _process_CONFIG(self, expression):
        # noinspection PyPep8Naming
        ALLOWED_KEYS = [None, 'URL']

        subexpression = expression[len('CONFIG'):].strip()
        # CONFIG require an index between square brackets and an optional
        # key after a dot.

        # CONFIG[1] returns the name of the config with id=1
        # CONFIG[1].URL returns the URL to download that config
        match = re.match(r'^\[([0-9]+)\]\s*(\.\s*([A-Za-z0-9]+))?$', subexpression)
        if match is None:
            # No index, invalid expression
            return None

        config_id = int(match.group(1))

        key = match.group(3)
        if key not in ALLOWED_KEYS:
            return None

        try:
            config = Config.objects.get(id=config_id)
        except Config.DoesNotExist:
            return None

        if key is None:
            return config.name
        if key == 'URL':
            config_base_url = get_config_base_url(self.request)
            return f'{config_base_url}{config.name}'

        # Should NEVER occur
        return None

    def _process_CONFIG_PATH(self, expression):
        if expression != 'CONFIG_PATH':
            # CONFIG_PATH expects no index and no keys
            return None

        return f'{settings.ZTP_CONFIG_URL}'

    def _process_FIRMWARE(self, expression):
        # noinspection PyPep8Naming
        ALLOWED_KEYS = [None, 'MD5', 'SHA512', 'SIZE', 'URL']

        subexpression = expression[len('FIRMWARE'):].strip()
        # FIRMWARE require an index between square brackets and an optional
        # key after a dot.

        # FIRMWARE[1] returns the filename of firmware with id=1
        # FIRMWARE[1].URL returns the URL to download that firmware
        # FIRMWARE[1].SIZE returns the file size
        # FIRMWARE[1].SHA512 returns the SHA512 hash value
        # FIRMWARE[1].MD5 returns the MD5 hash value
        match = re.match(r'^\[([0-9]+)\]\s*(\.\s*([A-Za-z0-9]+))?$', subexpression)
        if match is None:
            # No index, invalid expression
            return None

        firmware_id = int(match.group(1))

        key = match.group(3)
        if key not in ALLOWED_KEYS:
            return None

        try:
            firmware = Firmware.objects.get(id=firmware_id)
        except Firmware.DoesNotExist:
            return None

        if key is None:
            return firmware.file.name
        if key == 'MD5':
            return firmware.md5_hash
        if key == 'SHA512':
            return firmware.sha512_hash
        if key == 'SIZE':
            return str(firmware.filesize)
        if key == 'URL':
            firmware_base_url = get_firwmare_base_url(self.request)
            return f'{firmware_base_url}{firmware.file.name}'

        # Should NEVER occur
        return None

    def _process_FIRMWARE_PATH(self, expression):
        if expression != 'FIRMWARE_PATH':
            # FIRMWARE_PATH expects no index and no keys
            return None

        return f'{settings.ZTP_FIRMWARES_URL}'

    def _process_HTTP_SERVER(self, expression):
        if expression != 'HTTP_SERVER':
            # HTTP_SERVER expects no index and no keys
            return None

        return get_root_url(self.request)

    def _process_PORT(self, expression):
        if expression != 'PORT':
            # PORT expects no index and no keys
            return None

        return get_port(self.request)

    def _process_PROTOCOL(self, expression):
        if expression != 'PROTOCOL':
            # HTTP_SERVER expects no index and no keys
            return None

        return get_protocol(self.request)

    def _process_SERVER_NAME(self, expression):
        if expression != 'SERVER_NAME':
            # SERVER_NAME expects no index and no keys
            return None

        return get_domain(self.request)

    def _process_ZTP(self, expression):
        # noinspection PyPep8Naming
        ALLOWED_KEYS = [None, 'URL']

        subexpression = expression[len('ZTP'):].strip()
        # ZTP require an index between square brackets and an optional
        # key after a dot.

        # ZTP[1] returns the name of the ZTP script with id=1
        # ZTP[1].URL returns the URL to download that ZTP script
        # noinspection RegExpRedundantEscape
        match = re.match(r'^\[([0-9]+)\]\s*(\.\s*([A-Za-z0-9]+))?$', subexpression)
        if match is None:
            # No index, invalid expression
            return None

        ztp_script_id = int(match.group(1))

        key = match.group(3)
        if key not in ALLOWED_KEYS:
            return None

        try:
            ztp_script = ZtpScript.objects.get(id=ztp_script_id)
        except ZtpScript.DoesNotExist:
            return None

        if key is None:
            return ztp_script.name
        if key == 'URL':
            ztp_script_base_url = get_ztp_script_base_url(self.request)
            return f'{ztp_script_base_url}{ztp_script.name}'

        # Should NEVER occur
        return None

    def _process_ZTP_PATH(self, expression):
        if expression != 'ZTP_PATH':
            # ZTP_PATH expects no index and no keys
            return None

        return f'{settings.ZTP_BOOTSTRAP_URL}'
