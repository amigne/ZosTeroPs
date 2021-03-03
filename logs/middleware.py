from .models import LogsManager


class ModelChangeLoggingMiddleware:
    """
    Middleware setting the `user` and `remote_addr` class attributes.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        LogsManager.user = request.user
        LogsManager.remote_addr = (request.META.get('HTTP_X_FORWARDED_FOR').split(',')[0]
                                   if request.META.get('HTTP_X_FORWARDED_FOR')
                                   else request.META.get('REMOTE_ADDR'))

        return self.get_response(request)
