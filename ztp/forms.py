from django import forms

from .models import Config, ZtpScript


class ConfigForm(forms.ModelForm):
    class Meta:
        model = Config
        fields = ['name', 'description', 'language', 'template']
        widgets = {
            'name': forms.TextInput(attrs={'required': True}),
            'description': forms.Textarea(),
            'template': forms.Textarea(),
        }


class ZtpScriptForm(forms.ModelForm):
    class Meta:
        model = ZtpScript
        fields = ['name', 'render_template', 'use_parameters',
                  'accept_query_string', 'priority_query_string_over_arguments',
                  'description', 'language', 'template']
        widgets = {
            'name': forms.TextInput(attrs={'required': True}),
            'render_template': forms.CheckboxInput(),
            'use_parameters': forms.CheckboxInput(),
            'accept_query_string': forms.CheckboxInput(),
            'priority_query_string_over_arguments': forms.CheckboxInput(),
            'description': forms.Textarea(),
            'template': forms.Textarea(),
        }
