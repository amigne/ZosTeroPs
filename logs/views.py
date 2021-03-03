from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.utils.translation import gettext_lazy as _
from django.views.generic import ListView

from utils.views import ContextMixin

from .models import Logs


#
# Log
#
class LogsListView(ContextMixin, LoginRequiredMixin, PermissionRequiredMixin, ListView):
    model = Logs
    menu_item = 'log'
    template_name = 'logs/logs_view.html'
    permission_required = 'logs.list_log'
    object_description = _('logs')
    object_description_plural = _('logs')
    list_fields = ['id', 'created', 'severity', 'location-type', 'description', 'metadata', 'user']
    paginate_by = 15

    @property
    def can_list(self):
        return self.request.user.has_perm('logs.list_logs')
