from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import NOT_PROVIDED, DateTimeField, Model
from django.utils import timezone
from django.utils.encoding import force_str


def track_field(field):
    from .models import Logs

    # Do not track many to many relations
    if field.many_to_many:
        return False

    # Do not track relations to LogEntry
    if getattr(field, 'remote_field', None) is not None and field.remote_field.model == Logs:
        return False

    return True


def get_fields_in_model(instance):
    assert isinstance(instance, Model)

    return [f for f in instance._meta.get_fields() if track_field(f)]


def get_field_value(obj, field):
    if isinstance(field, DateTimeField):
        # DateTimeFields are timezone-aware, so we need to convert the field
        # to its naive form before we can accurately compare them for changes.
        try:
            value = field.to_python(getattr(obj, field.name, None))
            if value is not None and settings.USE_TZ and not timezone.is_naive(value):
                value = timezone.make_naive(value, timezone=timezone.utc)
        except ObjectDoesNotExist:
            value = field.default if field.default is not NOT_PROVIDED else None
    else:
        try:
            value = force_str(getattr(obj, field.name, None))
        except ObjectDoesNotExist:
            value = field.default if field.default is not NOT_PROVIDED else None

    return value


def model_instance_diff(old, new):
    from .registry import model_change_logger

    if not (old is None or isinstance(old, Model)):
        raise TypeError('The supplied old instance is not a valid model instance.')
    if not (new is None or isinstance(new, Model)):
        raise TypeError('The supplied new instance is not a valid model instance.')

    diff = {}

    if old is not None and new is not None:
        fields = set(old._meta.fields + new._meta.fields)
        model_fields = model_change_logger.get_model_fields(new._meta.model)
    elif old is not None:
        fields = set(get_fields_in_model(old))
        model_fields = model_change_logger.get_model_fields(old._meta.model)
    elif new is not None:
        fields = set(get_fields_in_model(new))
        model_fields = model_change_logger.get_model_fields(new._meta.model)
    else:
        fields = set()
        model_fields = None

    # Check if fields must be filtered
    if model_fields and (model_fields['include_fields'] or model_fields['exclude_fields']) and fields:
        if model_fields['include_fields']:
            filtered_fields = [field for field in fields if field.name in model_fields['include_fields']]
        else:
            filtered_fields = fields

        if model_fields['exclude_fields']:
            filtered_fields = [field for field in filtered_fields if field.name not in model_fields['exclude_fields']]
        fields = filtered_fields

    for field in fields:
        old_value = get_field_value(old, field)
        new_value = get_field_value(new, field)

        if old_value != new_value:
            diff[field.name] = (force_str(old_value), force_str(new_value))

    if len(diff) == 0:
        diff = None

    return diff
