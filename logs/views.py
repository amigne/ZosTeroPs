from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView, ListView

from utils.views import ContextMixin

from .models import Logs


class LogsContextMixin(ContextMixin, LoginRequiredMixin, PermissionRequiredMixin):
    model = Logs
    menu_item = 'log'
    object_description = _('log')
    object_description_plural = _('logs')
    list_fields = ['id', 'created', 'severity', 'location-type', 'description', 'metadata', 'user']

    @property
    def can_list(self):
        return self.request.user.has_perm('logs.list_log')

    @property
    def can_view(self):
        return self.request.user.has_perm('logs.view_log')


class LogsListView(LogsContextMixin, ListView):
    template_name = 'logs/list.html'
    permission_required = 'logs.list_log'
    paginate_by = 15


class LogsDetailView(LogsContextMixin, DetailView):
    template_name = 'logs/detail.html'
    permission_required = 'logs.view_log'

    #def get_object(self, queryset=None):
    #    obj = super(LogsDetailView, self).get_object(queryset)
    #    return obj
