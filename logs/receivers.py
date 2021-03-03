from .diff import model_instance_diff

from .models import Logs, LogsManager


def log_create(sender, instance, created, **kwargs):
    if created:
        changes = model_instance_diff(None, instance)
        Logs.objects.log_create(instance, action=LogsManager.Action.CREATE, changes=changes)


def log_update(sender, instance, **kwargs):
    if instance.pk is not None:
        try:
            old = sender.objects.get(pk=instance.pk)
        except sender.DoesNotExist:
            pass
        else:
            new = instance

            changes = model_instance_diff(old, new)
            Logs.objects.log_create(instance, action=LogsManager.Action.UPDATE, changes=changes)


def log_delete(sender, instance, **kwargs):
    if instance.pk is not None:
        changes = model_instance_diff(instance, None)
        Logs.objects.log_create(instance, action=LogsManager.Action.DELETE, changes=changes)
