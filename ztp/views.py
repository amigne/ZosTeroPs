import locale

from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.db import transaction
from django.http import FileResponse, Http404, HttpResponse
from django.template import Context, Template
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _, gettext_noop
from django.views.generic import DetailView, ListView, TemplateView
from django.views.generic.edit import (CreateView, DeleteView, UpdateView)

from logs.models import log_factory
from utils.views import ContextMixin

from .forms import ConfigForm, ZtpScriptForm
from .formset import ConfigParameterFormSet, ZtpParameterFormSet
from .models import (Config, Firmware, Platform, Vendor,
                     ZtpScript)
from .preprocessor import Preprocessor
from .utils import (get_config_base_url, get_firwmare_base_url, get_full_url,
                    get_ztp_script_base_url)
from .utils import (parameter_table_to_dict, preprocess_params)


#
# Home
#
class HomeView(ContextMixin, TemplateView):
    menu_item = 'home'
    template_name = 'ztp/home.html'


#
# About
#
class AboutView(ContextMixin, TemplateView):
    menu_item = 'about'
    template_name = 'ztp/about.html'


#
# ZTP Script
#
class ZtpContextMixin(ContextMixin, LoginRequiredMixin, PermissionRequiredMixin):
    model = ZtpScript
    menu_item = 'ztpScript'
    object_description = _('ZTP script')
    object_description_plural = _('ZTP scripts')
    form_class = ZtpScriptForm
    formset_class = ZtpParameterFormSet
    list_fields = ['id', 'name', 'description']
    url_create = reverse_lazy('ztpCreate')

    @property
    def can_add(self):
        return self.request.user.has_perm('ztp.add_ztpscript')

    @property
    def can_change(self):
        return self.request.user.has_perm('ztp.change_ztpscript')

    @property
    def can_delete(self):
        return self.request.user.has_perm('ztp.delete_ztpscript')

    @property
    def can_list(self):
        return self.request.user.has_perm('ztp.list_ztpscript')

    @property
    def can_view(self):
        return self.request.user.has_perm('ztp.view_ztpscript')


class ZtpCreateView(ZtpContextMixin, CreateView):
    template_name = 'ztp/generic/form.html'
    permission_required = 'ztp.add_ztpscript'

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
        if self.can_view:
            return reverse_lazy('ztpDetail', kwargs={'pk': self.object.pk})
        elif self.can_list:
            return reverse_lazy('ztpList')
        else:
            return reverse_lazy('home')


class ZtpDeleteView(ZtpContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    permission_required = 'ztp.delete_ztpscript'

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('ztpList')
        else:
            return reverse_lazy('home')


class ZtpDetailView(ZtpContextMixin, DetailView):
    template_name = 'ztp/generic/detail.html'
    permission_required = 'ztp.view_ztpscript'

    def get_object(self, queryset=None):
        obj = super(ZtpDetailView, self).get_object(queryset)

        base_url = get_ztp_script_base_url(self.request)
        obj.url = f'{base_url}{obj.name}'
        return obj


class ZtpListView(ZtpContextMixin, ListView):
    template_name = 'ztp/generic/list.html'
    permission_required = 'ztp.list_ztpscript'


class ZtpUpdateView(ZtpContextMixin, UpdateView):
    template_name = 'ztp/generic/form.html'
    permission_required = 'ztp.change_ztpscript'

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
        if self.can_view:
            return reverse_lazy('ztpDetail', kwargs={'pk': self.object.pk})
        elif self.can_list:
            return reverse_lazy('ztpList')
        else:
            return reverse_lazy('home')


#
# Configuration
#
class ConfigContextMixin(ContextMixin, LoginRequiredMixin, PermissionRequiredMixin):
    model = Config
    menu_item = 'config'
    object_description = _('configuration')
    object_description_plural = _('configurations')
    form_class = ConfigForm
    formset_class = ConfigParameterFormSet
    list_fields = ['id', 'name', 'description']
    url_create = reverse_lazy('configCreate')

    @property
    def can_add(self):
        return self.request.user.has_perm('ztp.add_config')

    @property
    def can_change(self):
        return self.request.user.has_perm('ztp.change_config')

    @property
    def can_delete(self):
        return self.request.user.has_perm('ztp.delete_config')

    @property
    def can_list(self):
        return self.request.user.has_perm('ztp.list_config')

    @property
    def can_view(self):
        return self.request.user.has_perm('ztp.view_config')


class ConfigCreateView(ConfigContextMixin, CreateView):
    template_name = 'ztp/generic/form.html'
    permission_required = 'ztp.add_config'

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
        if self.can_view:
            return reverse_lazy('configDetail', kwargs={'pk': self.object.pk})
        elif self.can_list:
            return reverse_lazy('configList')
        else:
            return reverse_lazy('home')


class ConfigDeleteView(ConfigContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    success_url = reverse_lazy('configList')
    permission_required = 'ztp.delete_config'

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('configList')
        else:
            return reverse_lazy('home')


class ConfigDetailView(ConfigContextMixin, DetailView):
    template_name = 'ztp/generic/detail.html'
    permission_required = 'ztp.view_config'

    def get_object(self, queryset=None):
        obj = super(ConfigDetailView, self).get_object(queryset)

        base_url = get_config_base_url(self.request)
        obj.url = f'{base_url}{obj.name}'
        return obj


class ConfigListView(ConfigContextMixin, ListView):
    template_name = 'ztp/generic/list.html'
    permission_required = 'ztp.list_config'


class ConfigUpdateView(ConfigContextMixin, UpdateView):
    template_name = 'ztp/generic/form.html'
    permission_required = 'ztp.change_config'

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
        if self.can_view:
            return reverse_lazy('configDetail', kwargs={'pk': self.object.pk})
        elif self.can_list:
            return reverse_lazy('configList')
        else:
            return reverse_lazy('home')


#
# Firmware
#
class FirmwareContextMixin(ContextMixin, LoginRequiredMixin, PermissionRequiredMixin):
    model = Firmware
    menu_item = 'firmware'
    object_description = _('firmware')
    object_description_plural = _('firmwares')
    list_fields = ['id', 'platform', 'file', 'description']
    url_create = reverse_lazy('firmwareCreate')

    @property
    def can_add(self):
        return self.request.user.has_perm('ztp.add_firmware')

    @property
    def can_change(self):
        return self.request.user.has_perm('ztp.change_firmware')

    @property
    def can_delete(self):
        return self.request.user.has_perm('ztp.delete_firmware')

    @property
    def can_list(self):
        return self.request.user.has_perm('ztp.list_firmware')

    @property
    def can_view(self):
        return self.request.user.has_perm('ztp.view_firmware')


class FirmwareCreateView(FirmwareContextMixin, SuccessMessageMixin, CreateView):
    template_name = 'ztp/generic/form.html'
    fields = ['platform', 'file', 'description']
    permission_required = 'ztp.add_firmware'

    def get_success_message(self, cleaned_data):
        form = self.get_form()
        instance = form.instance
        locale.setlocale(locale.LC_ALL, '')
        return f"Firmware {instance.file.name} successfully created! File size is {instance.filesize:n} bytes." \
               f" MD5 hash is {instance.md5_hash}. SHA512 hash is {instance.sha512_hash}."

    def get_success_url(self):
        if self.can_view:
            return reverse_lazy('firmwareDetail', kwargs={'pk': self.object.pk})
        elif self.can_list:
            return reverse_lazy('firmwareList')
        else:
            return reverse_lazy('home')


class FirmwareDeleteView(FirmwareContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    permission_required = 'ztp.delete_firmware'

    def get_success_url(self):
        if self.can_view:
            return reverse_lazy('firmwareDetail', kwargs={'pk': self.object.pk})
        elif self.can_list:
            return reverse_lazy('firmwareList')
        else:
            return reverse_lazy('home')


class FirmwareDetailView(FirmwareContextMixin, DetailView):
    template_name = 'ztp/generic/detail.html'
    permission_required = 'ztp.view_firmware'

    def get_object(self, queryset=None):
        obj = super(FirmwareDetailView, self).get_object(queryset)

        base_url = get_firwmare_base_url(self.request)
        obj.url = f'{base_url}{obj.file.name}'
        return obj


class FirmwareListView(FirmwareContextMixin, ListView):
    template_name = 'ztp/generic/list.html'
    permission_required = 'ztp.list_firmware'


class FirmwareUpdateView(FirmwareContextMixin, SuccessMessageMixin, UpdateView):
    template_name = 'ztp/generic/form.html'
    fields = ['platform', 'file', 'description']
    permission_required = 'ztp.change_firmware'

    def get_success_message(self, cleaned_data):
        form = self.get_form()
        instance = form.instance
        locale.setlocale(locale.LC_ALL, '')
        return f"Firmware {instance.file.name} successfully modified! File size is {instance.filesize:n} bytes. " \
               f"MD5 hash is {instance.md5_hash}. SHA512 hash is {instance.sha512_hash}."

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('firmwareList')
        else:
            return reverse_lazy('home')


#
# Platform
#
class PlatformContextMixin(ContextMixin, LoginRequiredMixin, PermissionRequiredMixin):
    model = Platform
    menu_item = 'platform'
    object_description = _('platform')
    object_description_plural = _('platforms')
    list_fields = ['id', 'vendor', 'name', 'description']
    url_create = reverse_lazy('platformCreate')

    @property
    def can_add(self):
        return self.request.user.has_perm('ztp.add_platform')

    @property
    def can_change(self):
        return self.request.user.has_perm('ztp.change_platform')

    @property
    def can_delete(self):
        return self.request.user.has_perm('ztp.delete_platform')

    @property
    def can_list(self):
        return self.request.user.has_perm('ztp.list_platform')

    @property
    def can_view(self):
        return False  # self.request.user.has_perm('ztp.view_platform')


class PlatformCreateView(PlatformContextMixin, CreateView):
    template_name = 'ztp/generic/form.html'
    fields = ['vendor', 'name', 'description']
    permission_required = 'ztp.add_platform'

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('platformList')
        else:
            return reverse_lazy('home')


class PlatformDeleteView(PlatformContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    permission_required = 'ztp.delete_platform'

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('platformList')
        else:
            return reverse_lazy('home')


class PlatformListView(PlatformContextMixin, ListView):
    template_name = 'ztp/generic/list.html'
    permission_required = 'ztp.list_platform'


class PlatformUpdateView(PlatformContextMixin, UpdateView):
    template_name = 'ztp/generic/form.html'
    fields = ['vendor', 'name', 'description']
    permission_required = 'ztp.change_platform'

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('platformList')
        else:
            return reverse_lazy('home')


#
# Vendor
#
class VendorContextMixin(ContextMixin, LoginRequiredMixin, PermissionRequiredMixin):
    model = Vendor
    menu_item = 'vendor'
    object_description = _('vendor')
    object_description_plural = _('vendors')
    list_fields = ['id', 'name', 'description']
    url_create = reverse_lazy('vendorCreate')

    @property
    def can_add(self):
        return self.request.user.has_perm('ztp.add_vendor')

    @property
    def can_change(self):
        return self.request.user.has_perm('ztp.change_vendor')

    @property
    def can_delete(self):
        return self.request.user.has_perm('ztp.delete_vendor')

    @property
    def can_list(self):
        return self.request.user.has_perm('ztp.list_vendor')

    @property
    def can_view(self):
        return False  # self.request.user.has_perm('ztp.view_vendor')


class VendorCreateView(VendorContextMixin, CreateView):
    template_name = 'ztp/generic/form.html'
    fields = ['name', 'description']
    permission_required = 'ztp.add_vendor'

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('vendorList')
        else:
            return reverse_lazy('home')


class VendorDeleteView(VendorContextMixin, DeleteView):
    template_name = 'ztp/generic/confirm_delete.html'
    permission_required = 'ztp.delete_vendor'

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('vendorList')
        else:
            return reverse_lazy('home')


class VendorListView(VendorContextMixin, ListView):
    template_name = 'ztp/generic/list.html'
    permission_required = 'ztp.list_vendor'


class VendorUpdateView(VendorContextMixin, UpdateView):
    template_name = 'ztp/generic/form.html'
    fields = ['name', 'description']
    permission_required = 'ztp.change_vendor'

    def get_success_url(self):
        if self.can_list:
            return reverse_lazy('vendorList')
        else:
            return reverse_lazy('home')


#
# Content delivery
#
def ztp_download(request, name):
    metadata = {
        'ztp_script': name,
        'requested_url': get_full_url(request),
        'client': request.META['REMOTE_ADDR'],
    }
    log_factory(gettext_noop('%(client)s requests ZTP script "%(ztp_script)s".'), metadata).save()

    try:
        ztp_script = ZtpScript.objects.get(name=name)
    except ZtpScript.DoesNotExist:
        log_factory(gettext_noop('ZTP script "%(ztp_script)s" requested by %(client)s does not exist.'),
                    metadata, severity=4).save()
        raise Http404(_('ZTP Script does not exist!'))

    if not ztp_script.render_template:
        metadata['response'] = ztp_script.template
        log_factory(gettext_noop('ZTP script "%(ztp_script)s" requested by %(client)s sent.'),
                    metadata, severity=5).save()
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
        context_dict = {**parameters_context_dict, **query_string_context_dict}
    else:
        context_dict = {**query_string_context_dict, **parameters_context_dict}

    preprocessor = Preprocessor(request)
    context_dict = preprocess_params(context_dict)

    preprocessed_template = preprocessor.process(ztp_script.template)
    template = Template(preprocessed_template)
    response = template.render(Context(context_dict))
    metadata['response'] = response
    log_factory(gettext_noop('ZTP script "%(ztp_script)s" requested by %(client)s sent.'),
                metadata, severity=5).save()
    return HttpResponse(response, content_type='text/plain')


def config_download(request, name):
    metadata = {
        'config': name,
        'requested_url': get_full_url(request),
        'client': request.META['REMOTE_ADDR'],
    }
    log_factory(gettext_noop('%(client)s requests configuration "%(config)s".'), metadata).save()
    print(get_full_url(request))
    try:
        config = Config.objects.get(name=name)
    except Config.DoesNotExist:
        log_factory(gettext_noop('Configuration "%(config)s" requested by %(client)s does not exist.'),
                    metadata, severity=4).save()
        raise Http404(_('Configuration does not exist!'))

    arguments = request.GET.dict()

    parameters_dict = dict()
    for parameter in config.parameters.all():
        # Retrieve dict from the parameter table
        parameter_dict = parameter_table_to_dict(parameter)

        # Retrieve the value from the URL line, if given
        url_value = arguments[parameter.name] if parameter.name in arguments else None

        if parameter.is_mandatory and url_value is None:
            metadata['invalid_parameter'] = parameter.name
            log_factory(gettext_noop('Configuration "%(config)s" requested by %(client)s miss mandatory parameter '
                        '"%(invalid_parameter)s".'), metadata, severity=4).save()
            raise Http404(_('Missing mandatory parameter "%(name)s".') % {'name': parameter.name})

        # Select the dict entry for the matching value only
        match = parameter_dict[url_value] if url_value in parameter_dict else None

        if parameter.is_mandatory and match is None:
            metadata['invalid_parameter'] = parameter.name
            log_factory(gettext_noop('Configuration "%(config)s" requested by %(client)s has no matching value for '
                        'parameter "%(invalid_parameter)s".'), metadata, severity=4).save()
            raise Http404(_('No matching value for parameter "%(name)s".') % {'name': parameter.name})

        # Merge the values all together (redundant values are overwritten)
        if match:
            parameters_dict = {**parameters_dict, **match}

    # We create a preprocessor instance now, so the request is passed to the class
    preprocessor = Preprocessor(request)

    parameters_dict = preprocess_params(parameters_dict)
    preprocessed_template = preprocessor.process(config.template)

    template = Template(preprocessed_template)
    response = template.render(Context(parameters_dict))
    metadata['response'] = response
    log_factory(gettext_noop('Config "%(config)s" requested by %(client)s sent.'),
                metadata, severity=5).save()
    return HttpResponse(response, content_type='text/plain')


def firmware_download(request, filename):
    metadata = {
        'firmware': filename,
        'requested_url': get_full_url(request),
        'client': request.META['REMOTE_ADDR'],
    }
    log_factory(gettext_noop('%(client)s requests firmware "%(firmware)s".'), metadata).save()

    try:
        p = Firmware.objects.get(file=filename)
    except Firmware.DoesNotExist:
        log_factory(gettext_noop('Firmware "%(firmware)s" requested by %(client)s does not exist.'),
                    metadata, severity=4).save()
        raise Http404(_('Firmware does not exist!'))

    log_factory(gettext_noop('Firmware "%(firmware)s" requested by %(client)s sent.'),
                metadata, severity=5).save()
    return FileResponse(p.file.open('rb'), content_type='application/octet-stream')
