from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet, inlineformset_factory
from django.utils.translation import gettext as _
from .models import Config, ConfigParameter, ZtpParameter, ZtpScript


class BaseParameterFormSet(BaseInlineFormSet):
    def clean(self):
        """Checks that no two parameters have the same key."""
        if any(self.errors):
            # Don't bother validating the formset unless each form is valid on its own
            return

        names = []
        for form in self.forms:
            if self.can_delete and self._should_delete_form(form):
                continue
            name = form.cleaned_data.get('name')
            if name:
                if name in names:
                    raise ValidationError(_('There must not be multiple parameters with the same name.'))
                names.append(name)


ConfigParameterFormSet = inlineformset_factory(
    Config,
    ConfigParameter,
    formset=BaseParameterFormSet,
    fields=['name', 'data', 'is_mandatory'],
    extra=0,
    min_num=1,
    can_delete=True
)


ZtpParameterFormSet = inlineformset_factory(
    ZtpScript,
    ZtpParameter,
    formset=BaseParameterFormSet,
    fields=['name', 'value'],
    extra=0,
    min_num=1,
    can_delete=True
    )
