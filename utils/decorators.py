from django.conf import settings
from django.http import HttpResponseRedirect


def ssl_required(view_func):
    def _wrapped_view_func(request, *args, **kwargs):
        if (hasattr(settings, 'GUI_SSL_REDIRECT') and settings.GUI_SSL_REDIRECT
                and request and not request.is_secure()):
            request_url = request.build_absolute_uri(request.get_full_path())
            secure_url = request_url.replace('http://', 'https://')
            return HttpResponseRedirect(secure_url)
        return view_func(request, *args, **kwargs)
    return _wrapped_view_func
