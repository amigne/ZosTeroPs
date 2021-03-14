from django.conf import settings


def context(request):
    """
    Return context variables for ZosTeroPs.
    """

    return {
        'VERSION': settings.VERSION
    }
