from django import forms

from .models import ZtpParameter, ZtpScript


class ZtpParameterForm(forms.ModelForm):
    class Meta:
        model=ZtpParameter
        fields=[ 'key', 'value' ]
        widgets = {
            'key': forms.TextInput(attrs={'required': True}),
            'value': forms.TextInput(),
        }


class ZtpScriptForm(forms.ModelForm):
    class Meta:
        model=ZtpScript
        fields=[ 'name', 'render_template', 'use_parameters',
                 'accept_query_string', 'priority_query_string_over_arguments',
                 'description', 'template' ]
        widgets = {
            'name': forms.TextInput(attrs={'required': True}),
            'render_template': forms.CheckboxInput(),
            'use_parameters': forms.CheckboxInput(),
            'accept_query_string': forms.CheckboxInput(),
            'priority_query_string_over_arguments': forms.CheckboxInput(),
            'description': forms.Textarea(),
            'template': forms.Textarea(),
        }
