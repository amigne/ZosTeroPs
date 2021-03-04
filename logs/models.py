from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.urls import reverse_lazy
from django.utils import timezone
from django.utils.encoding import force_str
from django.utils.translation import gettext_lazy as _, gettext_noop

from utils.models import DateUserBaseModel


class LogsManager(models.Manager):
    user = None
    remote_addr = None

    class Action:
        CREATE = 0
        UPDATE = 1
        DELETE = 2

    def log_create (self, instance, **kwargs):
        metadata = dict()

        changes = metadata['changes'] = kwargs.get('changes', None)
        pk = metadata['object_pk'] = self._get_pk_value(instance)
        if changes is not None:
            metadata['content_type'] = force_str(ContentType.objects.get_for_model(instance))
            metadata['model_verbose'] = instance._meta.verbose_name.capitalize()
            metadata['object_repr'] = force_str(instance)

            if isinstance(pk, int):
                metadata['object_id'] = pk

            get_additional_data = getattr(instance, 'get_additional_data', None)
            if callable(get_additional_data):
                metadata['additional_data'] = get_additional_data()

            action = kwargs.get('action', None)
            if action is LogsManager.Action.CREATE:
                description = gettext_noop('%(model_verbose)s "%(object_repr)s" created by %(user)s.')
                severity = Logs.Severity.NOTICE
            elif action is LogsManager.Action.UPDATE:
                description = gettext_noop('%(model_verbose)s "%(object_repr)s" updated by %(user)s.')
                severity = Logs.Severity.NOTICE
            elif action is LogsManager.Action.DELETE:
                description = gettext_noop('%(model_verbose)s "%(object_repr)s" deleted by %(user)s.')
                severity = Logs.Severity.WARNING
            else:
                return

            metadata['user_id'] = LogsManager.user.id
            metadata['user'] = LogsManager.user.username
            metadata['remote_addr'] = LogsManager.remote_addr

            log_factory(description, extra_meta=metadata,
                        severity=severity, task_type=Logs.TaskType.ADMIN, user=LogsManager.user).save()

    def get_for_model(self, model):
        if not issubclass(model, models.Model):
            return self.none()

        content_type = ContentType.objects.get_for_model(model)

        return self.filter(content_type=content_type)

    def _get_pk_value(self, instance):
        pk_field = instance._meta.pk.name
        pk = getattr(instance, pk_field, None)

        # Check to make sure that we got an pk not a model object.
        if isinstance(pk, models.Model):
            pk = self._get_pk_value(pk)
        return pk


class Logs(DateUserBaseModel):
    class Severity:
        EMERGENCY = 0
        ALERT = 1
        CRITICAL = 2
        ERROR = 3
        WARNING = 4
        NOTICE = 5
        INFO = 6
        DEBUG = 7

        choices = (
            (EMERGENCY, _('EMERGENCY')),
            (ALERT, _('ALERT')),
            (CRITICAL, _('CRITICAL')),
            (ERROR, _('ERROR')),
            (WARNING, _('WARNING')),
            (NOTICE, _('NOTICE')),
            (INFO, _('INFO')),
            (DEBUG, _('DEBUG')),
        )

    class Location:
        LOCAL = 0
        REMOTE = 1

        choices = (
            (LOCAL, _('local')),
            (REMOTE, _('remote')),
        )

    class TaskType:
        ADMIN = 0
        OPERATION = 1
        DEBUGGING = 2

        choices = (
            (ADMIN, _('admin')),
            (OPERATION, _('operation')),
            (DEBUGGING, _('debugging')),
        )

    severity = models.PositiveSmallIntegerField(_('severity'),
                                                choices=Severity.choices,
                                                default=Severity.INFO)
    location = models.PositiveSmallIntegerField(_('location'),
                                                choices=Location.choices,
                                                default=Location.LOCAL)
    task_type = models.PositiveSmallIntegerField(_('task type'),
                                                 choices=TaskType.choices,
                                                 default=TaskType.OPERATION)
    description = models.TextField(_('description'), blank=True)
    metadata = models.JSONField(_('meta-data'), blank=True)

    objects = LogsManager()

    @property
    def url_detail(self):
        return reverse_lazy('logs:detail', kwargs={'pk': self.id})

    def __str__(self):
        metadata = self.metadata
        metadata['created'] = self.created
        metadata['updated'] = self.updated
        return _(self.description) % metadata

    class Meta:
        verbose_name = _('log')
        permissions = (
            ('list_log', _('Can list logs')),
            ('view_log', _('Can view logs')),
        )


def log_factory(description,
                extra_meta=None,
                severity=Logs.Severity.INFO,
                location=Logs.Location.LOCAL,
                task_type=Logs.TaskType.OPERATION,
                user=None):
    if extra_meta is None:
        extra_meta = {}
    metadata = dict()
    metadata['datetime'] = timezone.now().isoformat()
    metadata = {**metadata, **extra_meta}

    return Logs(description=description,
                metadata=metadata,
                severity=severity,
                location=location,
                task_type=task_type,
                user=user)
