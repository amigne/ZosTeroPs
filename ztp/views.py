import locale

from django.contrib.messages.views import SuccessMessageMixin
from django.db import transaction
from django.http import Http404, HttpResponse
from django.template import Context, Template
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView, ListView, TemplateView
from django.views.generic.base import ContextMixin as BaseContextMixin
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from .forms import ConfigForm, ZtpScriptForm
from .formset import ConfigParameterFormSet, ZtpParameterFormSet
from .models import Config, Firmware, Platform, Vendor, ZtpScript


class ContextMixin(BaseContextMixin):
    """ Mixin that sets some context data common to the different view classes. """

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)

        # Workaround as self.object is not defined for list and detail views
        object = getattr(self, 'object', None)

        if hasattr(self, 'formset_class'):
            if self.request.POST:
                context_data['formset'] = self.formset_class(self.request.POST, instance=object)
            else:
                context_data['formset'] = self.formset_class(instance=object)

        for attr in ['list_fields', 'menu_item', 'object_description',
                     'object_description_plural', 'url_create']:
            if hasattr(self, attr):
                context_data[attr] = getattr(self, attr, None)

        return context_data

###
### Home
###
class HomeView(ContextMixin, TemplateView):
    menu_item = 'home'
    template_name = 'ztp/home.html'


###
### About
###
class AboutView(ContextMixin, TemplateView):
    menu_item = 'about'
    template_name = 'ztp/about.html'


###
### ZTP Script
###
class ZtpContextMixin(ContextMixin):
    model = ZtpScript
    menu_item = 'ztpScript'
    object_description = _('ZTP script')
    object_description_plural = _('ZTP scripts')
    form_class = ZtpScriptForm
    formset_class = ZtpParameterFormSet
    list_fields = ['id', 'name', 'description']
    url_create = reverse_lazy('ztpCreate')


class ZtpCreateView(ZtpContextMixin, CreateView):
    template_name = 'ztp/generic/form.html'

    def post(self, request, *args, **kwargs):
        self.object = None
        context = self.get_context_data()

        form = self.get_form()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            with transaction.atomic():
                self.object = form.save()
                formset.instance = self.object
                formset.save()
        return super(ZtpCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse_lazy('ztpDetail', kwargs={'pk': self.object.pk})


class ZtpDeleteView(ZtpContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    success_url = reverse_lazy('ztpList')


class ZtpDetailView(ZtpContextMixin, DetailView):
    template_name = 'ztp/generic/detail.html'


class ZtpListView(ZtpContextMixin, ListView):
    template_name = 'ztp/generic/list.html'


class ZtpUpdateView(ZtpContextMixin, UpdateView):
    template_name = 'ztp/generic/form.html'

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data()

        form = self.get_form()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            with transaction.atomic():
                self.object = form.save()
                formset.instance = self.object
                formset.save()
        return super(ZtpUpdateView, self).form_valid(form)

    def get_success_url(self):
        return reverse_lazy('ztpDetail', kwargs={'pk': self.object.pk})


###
### Configuration
###
class ConfigContextMixin(ContextMixin):
    model = Config
    menu_item = 'config'
    object_description = _('configuration')
    object_description_plural = _('configurations')
    form_class = ConfigForm
    formset_class = ConfigParameterFormSet
    list_fields = ['id', 'name', 'description']
    url_create = reverse_lazy('configCreate')


class ConfigCreateView(ConfigContextMixin, CreateView):
    template_name = 'ztp/generic/form.html'

    def post(self, request, *args, **kwargs):
        self.object = None
        context = self.get_context_data()

        form = self.get_form()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            with transaction.atomic():
                self.object = form.save()
                formset.instance = self.object
                formset.save()
        return super(ConfigCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse_lazy('configDetail', kwargs={'pk': self.object.pk})


class ConfigDeleteView(ConfigContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    success_url = reverse_lazy('configList')


class ConfigDetailView(ConfigContextMixin, DetailView):
    template_name = 'ztp/generic/detail.html'


class ConfigListView(ConfigContextMixin, ListView):
    template_name = 'ztp/generic/list.html'


class ConfigUpdateView(ConfigContextMixin, UpdateView):
    template_name = 'ztp/generic/form.html'

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data()

        form = self.get_form()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            with transaction.atomic():
                self.object = form.save()
                formset.instance = self.object
                formset.save()
        return super(ConfigUpdateView, self).form_valid(form)

    def get_success_url(self):
        return reverse_lazy('configDetail', kwargs={'pk': self.object.pk})


###
### Firmware
###
class FirmwareContextMixin(ContextMixin):
    model = Firmware
    menu_item = 'firmware'
    object_description = _('firmware')
    object_description_plural = _('firmwares')
    list_fields = ['id', 'platform', 'file', 'description']
    url_create = reverse_lazy('firmwareCreate')


class FirmwareCreateView(FirmwareContextMixin, SuccessMessageMixin, CreateView):
    template_name = 'ztp/generic/form.html'
    fields = ['platform', 'file', 'description']
    success_url = reverse_lazy('firmwareList')

    def get_success_message(self, cleaned_data):
        form = self.get_form()
        instance = form.instance
        locale.setlocale(locale.LC_ALL, '')
        return f"Firmware {instance.file.name} successfully created! File size is {instance.filesize:n} bytes." \
               f" MD5 hash is {instance.md5_hash}. SHA512 hash is {instance.sha512_hash}."


class FirmwareDeleteView(FirmwareContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    success_url = reverse_lazy('firmwareList')


class FirmwareDetailView(FirmwareContextMixin, DetailView):
    template_name = 'ztp/generic/detail.html'


class FirmwareListView(FirmwareContextMixin, ListView):
    template_name = 'ztp/generic/list.html'


class FirmwareUpdateView(FirmwareContextMixin, SuccessMessageMixin, UpdateView):
    template_name = 'ztp/generic/form.html'
    fields = ['platform', 'file', 'description']
    success_url = reverse_lazy('firmwareList')

    def get_success_message(self, cleaned_data):
        form = self.get_form()
        instance = form.instance
        locale.setlocale(locale.LC_ALL, '')
        return f"Firmware {instance.file.name} successfully modified! File size is {instance.filesize:n} bytes. " \
               f"MD5 hash is {instance.md5_hash}. SHA512 hash is {instance.sha512_hash}."


###
### Platform
###
class PlatformContextMixin(ContextMixin):
    model = Platform
    menu_item = 'platform'
    object_description = _('platform')
    object_description_plural = _('platforms')
    list_fields = ['id', 'vendor', 'name', 'description']
    url_create = reverse_lazy('platformCreate')


class PlatformCreateView(PlatformContextMixin, CreateView):
    template_name = 'ztp/generic/form.html'
    fields = ['vendor', 'name', 'description']
    success_url = reverse_lazy('platformList')


class PlatformDeleteView(PlatformContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    success_url = reverse_lazy('platformList')


class PlatformListView(PlatformContextMixin, ListView):
    template_name = 'ztp/generic/list.html'


class PlatformUpdateView(PlatformContextMixin, UpdateView):
    template_name = 'ztp/generic/form.html'
    fields = ['vendor', 'name', 'description']
    success_url = reverse_lazy('platformList')


###
### Vendor
###
class VendorContextMixin(ContextMixin):
    model = Vendor
    menu_item = 'vendor'
    object_description = _('vendor')
    object_description_plural = _('vendors')
    list_fields = ['id', 'name', 'description']
    url_create = reverse_lazy('vendorCreate')


class VendorCreateView(VendorContextMixin, CreateView):
    template_name = 'ztp/generic/form.html'
    fields = ['name', 'description']
    success_url = reverse_lazy('vendorList')


class VendorDeleteView(VendorContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    success_url = reverse_lazy('vendorList')


class VendorListView(VendorContextMixin, ListView):
    template_name = 'ztp/generic/list.html'


class VendorUpdateView(VendorContextMixin, UpdateView):
    template_name = 'ztp/generic/form.html'
    fields = ['name', 'description']
    success_url = reverse_lazy('vendorList')


###
### Content delivery
###
def ztp_download(request, name):
    try:
        ztp_script = ZtpScript.objects.get(name=name)
    except ZtpScript.DoesNotExist:
        raise Http404('ZTP Script does not exist!')

    if not ztp_script.render_template:
        return HttpResponse(ztp_script.template, content_type='text/plain')

    query_string_context_dict = {}
    if ztp_script.accept_query_string:
        arguments = request.GET.dict()
        for key in arguments.keys():
            query_string_context_dict[key] = arguments[key]

    parameters_context_dict = {}
    if ztp_script.use_parameters:
        for param in ztp_script.parameters.values():
            parameters_context_dict[param['name']] = param['value']

    if ztp_script.priority_query_string_over_arguments:
        context_dict = parameters_context_dict | query_string_context_dict
    else:
        context_dict = query_string_context_dict | parameters_context_dict

    template = Template(ztp_script.template)
    return HttpResponse(template.render(Context(context_dict)), content_type='text/plain')


def config_download(request, name):
    try:
        configuration = Config.objects.get(name=name)
    except Config.DoesNotExist:
        raise Http404('Configuration does not exist!')

    context_dict = dict()

    arguments = request.GET.dict()
    if len(arguments):
        # We have arguments so let's process them and the stored parameters' data
        parameters = configuration.data_to_dict()

        for key in arguments.keys():
            if key in parameters:
                value = arguments[key]
                if value in parameters[key]:
                    context_dict.update(parameters[key][value])

    template = Template(configuration.template)
    return HttpResponse(template.render(Context(context_dict)), content_type='text/plain')


def firmware_download(request, filename):
    try:
        p = Firmware.objects.get(file=filename)
    except Firmware.DoesNotExist:
        raise Http404('Firmware does not exist!')
    return HttpResponse(p.file.open('rb'), content_type='application/octet-stream')

