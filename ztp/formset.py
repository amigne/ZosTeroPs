from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet, inlineformset_factory

from .models import ZtpParameter, ZtpScript


class BaseParameterFormSet(BaseInlineFormSet):
    def clean(self):
        """Checks that no two parameters have the same key."""
        if any(self.errors):
            # Don't bother validating the formset unless each form is valid on its own
            return

        keys = []
        for form in self.forms:
            if self.can_delete and self._should_delete_form(form):
                continue
            key = form.cleaned_data.get('key')
            if key in keys:
                raise ValidationError('There must not be multiple parameters with the same key.')
            keys.append(key)


ZtpParameterFormSet = inlineformset_factory(
    ZtpScript,
    ZtpParameter,
    formset=BaseParameterFormSet,
    fields=['key', 'value'],
    extra=1,
    can_delete=True
    )
