from django.contrib.auth.mixins import (LoginRequiredMixin,
                                        PermissionRequiredMixin)
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView, ListView

from utils.decorators import ssl_required
from utils.views import ContextMixin

from .models import Logs


class LogsContextMixin(ContextMixin, LoginRequiredMixin, PermissionRequiredMixin):
    model = Logs
    menu_item = 'log'
    object_description = _('log')
    object_description_plural = _('logs')
    list_fields = ['id', 'created', 'severity', 'location', 'type', 'description', 'metadata', 'user']

    @property
    def can_list(self):
        return self.request.user.has_perm('logs.list_log')

    @property
    def can_view(self):
        return self.request.user.has_perm('logs.view_log')


@method_decorator(ssl_required, 'dispatch')
class LogsListView(LogsContextMixin, ListView):
    template_name = 'logs/list.html'
    permission_required = 'logs.list_log'


@method_decorator(ssl_required, 'dispatch')
class LogsDetailView(LogsContextMixin, DetailView):
    template_name = 'logs/detail.html'
    permission_required = 'logs.view_log'

