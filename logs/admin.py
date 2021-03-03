from django.contrib import admin
from .models import Logs


@admin.register(Logs)
class LogsAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'severity', 'location',
                    'task_type']
