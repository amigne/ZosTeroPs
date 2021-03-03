from django.db.models import Model
from django.db.models.signals import post_delete, post_save, pre_save

from .receivers import log_create, log_delete, log_update


class ModelChangeLoggingRegistry:
    """
    Registry of the models to track changes.
    """
    def __init__(self, create=True, update=True, delete=True, custom=None):
        self._registry = {}
        self._signals = {}

        if create:
            self._signals[post_save] = log_create
        if update:
            self._signals[pre_save] = log_update
        if delete:
            self._signals[post_delete] = log_delete

        if custom is not None:
            self._signals.update(custom)

    def register(self,
                 model=None,
                 include_fields=None,
                 exclude_fields=None,
                 mapping_fields=None):
        if include_fields is None:
            include_fields = []
        if exclude_fields is None:
            exclude_fields = []
        if mapping_fields is None:
            mapping_fields = {}

        def registrar(cls):
            if not issubclass(cls, Model):
                raise TypeError('Supplied model is not a valid model')

            self._registry[cls] = {
                'include_fields': include_fields,
                'exclude_fields': exclude_fields,
                'mapping_fields': mapping_fields,
            }
            self._connect_signals(cls)

            return cls

        if model is None:
            # Used as a decorator: return a callable with the wrapper
            return lambda cls: registrar(cls)
        else:
            registrar(model)

    def get_model_fields(self, model):
        return {
            'include_fields': list(self._registry[model]['include_fields']),
            'exclude_fields': list(self._registry[model]['exclude_fields']),
            'mapping_fields': dict(self._registry[model]['mapping_fields']),
        }

    def _connect_signals(self, model):
        for signal in self._signals:
            receiver = self._signals[signal]
            signal.connect(receiver, sender=model,
                           dispatch_uid=self._dispatch_uid(signal, model))

    def _dispatch_uid(self, signal, model):
        return self.__hash__(), model.__qualname__, signal.__hash__()


model_change_logger = ModelChangeLoggingRegistry()
